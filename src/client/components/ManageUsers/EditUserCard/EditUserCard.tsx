import React, { useEffect, useState } from 'react';
import styles from './EditUserCard.module.css';
import { IUser } from '../../../../common/types/IUser';
import Button from '../../Button/Button';
import closeIcon from '../../../assets/closeIcon.svg';
import SignUpForm from '../../Forms/SignupForm/SignUpForm';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserRequest } from '../../../store/slices/userSlice';
import { RootState } from '../../../store/store';

interface EditUserFormProps {
    user: IUser;
    onSave: () => void;
    onCancel: () => void;
}

interface SignUpFormData {
    firstName: string;
    lastName: string;
    email: string;
    role: 'student' | 'teacher';
    yearOfStudy: 1 | 2 | 3 | 4 | 5 | 6 | 7 | undefined;
    course: string;
    courseUnits: string[];
}

const EditUserForm: React.FC<EditUserFormProps> = ({
    user,
    onSave,
    onCancel
}) => {
    const { token } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState<SignUpFormData>({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role as 'student' | 'teacher',
        yearOfStudy: user.yearOfStudy as 1 | 2 | 3 | 4 | 5 | 6 | 7 | undefined,
        course: user.course?.toString() || '',
        courseUnits: user.courseUnits.map((unit) => unit.toString())
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        setFormData((prevState) => {
            if (type === 'checkbox' && name === 'courseUnits') {
                const updatedCourseUnits = (e.target as HTMLInputElement)
                    .checked
                    ? [...prevState.courseUnits, value]
                    : prevState.courseUnits.filter((unit) => unit !== value);
                return { ...prevState, courseUnits: updatedCourseUnits };
            }
            return { ...prevState, [name]: value };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(updateUserRequest({ formData, token }));
        onSave();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onCancel]);

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
                    Edit {user.firstName} {user.lastName}
                </h2>
                <div className={styles.contentContainer}>
                    <SignUpForm
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        handleBack={onCancel}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditUserForm;
