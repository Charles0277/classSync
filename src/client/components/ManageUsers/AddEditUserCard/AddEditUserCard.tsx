import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IUser } from '../../../../common/types/IUser';
import closeIcon from '../../../assets/closeIcon.svg';
import { signUpRequest } from '../../../store/slices/authSlice';
import { updateUserRequest } from '../../../store/slices/userSlice';
import { RootState } from '../../../store/store';
import Button from '../../Button/Button';
import SignUpForm from '../../Forms/SignupForm/SignUpForm';
import styles from './AddEditUserCard.module.css';

interface UserCardProps {
    mode: 'signUp' | 'edit' | 'admin';
    user?: IUser;
    onSave: () => void;
    onCancel: () => void;
}

interface SignUpFormData {
    firstName: string;
    lastName: string;
    email: string;
    role: 'student' | 'teacher';
    yearOfStudy: 1 | 2 | 3 | 4 | 5 | 7 | undefined;
    course: string;
    courseUnits: string[];
    password?: string;
    confirmPassword?: string;
}

const INITIAL_FORM_DATA: SignUpFormData = {
    firstName: '',
    lastName: '',
    email: '',
    role: 'student',
    yearOfStudy: undefined,
    course: '',
    courseUnits: []
};

const validateForm = (formData: SignUpFormData): boolean => {
    const {
        firstName,
        lastName,
        email,
        role,
        yearOfStudy,
        course,
        courseUnits
    } = formData;
    return Boolean(
        firstName.trim() &&
            lastName.trim() &&
            email.trim() &&
            role.trim() &&
            yearOfStudy !== undefined &&
            course.trim() &&
            courseUnits.length > 0
    );
};

const AddEditUserCard: React.FC<UserCardProps> = ({
    mode,
    user,
    onSave,
    onCancel
}) => {
    const dispatch = useDispatch();
    const { token } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState<SignUpFormData>(
        user && mode === 'edit'
            ? {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  role: user.role as 'student' | 'teacher',
                  yearOfStudy: user.yearOfStudy as
                      | 1
                      | 2
                      | 3
                      | 4
                      | 5
                      | 7
                      | undefined,
                  course: user.course?.toString() || '',
                  courseUnits: user.courseUnits.map((unit) => unit.toString()),
                  password: '',
                  confirmPassword: ''
              }
            : user && mode === 'admin'
              ? {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role as 'student' | 'teacher',
                    yearOfStudy: user.yearOfStudy as
                        | 1
                        | 2
                        | 3
                        | 4
                        | 5
                        | 7
                        | undefined,
                    course: user.course?.toString() || '',
                    courseUnits: user.courseUnits.map((unit) => unit.toString())
                }
              : INITIAL_FORM_DATA
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value, type } = e.target;

            setFormData((prev) =>
                type === 'checkbox' && name === 'courseUnits'
                    ? {
                          ...prev,
                          courseUnits: (e.target as HTMLInputElement).checked
                              ? [...prev.courseUnits, value]
                              : prev.courseUnits.filter(
                                    (unit) => unit !== value
                                )
                      }
                    : { ...prev, [name]: value }
            );
        },
        []
    );

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!validateForm(formData)) {
                alert(
                    'All fields are required. Please fill out all the fields.'
                );
                return;
            }
            if (mode === 'signUp') {
                dispatch(signUpRequest(formData));
            } else {
                dispatch(updateUserRequest({ formData, token }));
            }
            onSave();
        },
        [dispatch, formData, mode, onSave, token]
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    const contentClass =
        mode === 'admin' ? styles.noPassword : styles.includesPassword;

    return (
        <div
            className={styles.overlay}
            onClick={(e) => e.target === e.currentTarget && onCancel()}
        >
            <div className={styles.popupCard}>
                <div className={styles.closeIcon}>
                    <Button type="button" onClick={onCancel}>
                        <img src={closeIcon} alt="Close" />
                    </Button>
                </div>
                <h2 className={styles.popupTitle}>
                    {mode === 'signUp'
                        ? 'Add a New User'
                        : mode === 'admin'
                          ? `Edit ${user?.firstName} ${user?.lastName}`
                          : 'Edit Profile'}
                </h2>
                <div className={contentClass}>
                    <SignUpForm
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        handleBack={onCancel}
                        mode={mode}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddEditUserCard;
