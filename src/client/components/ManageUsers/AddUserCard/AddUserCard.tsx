import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SignUpForm from '../../Forms/SignupForm/SignUpForm';
import Button from '../../Button/Button';
import { signUpRequest } from '../../../store/slices/authSlice';
import closeIcon from '../../../assets/closeIcon.svg';
import styles from './AddUserCard.module.css';

interface AddUserFormProps {
    onSave: () => void;
    onCancel: () => void;
}

interface SignUpFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'student' | 'teacher';
    yearOfStudy: 1 | 2 | 3 | 4 | 5 | 6 | 7 | undefined;
    course: string;
    courseUnits: string[];
}

const INITIAL_FORM_DATA: SignUpFormData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    yearOfStudy: undefined,
    course: '',
    courseUnits: []
} as const;

const validateForm = (formData: SignUpFormData): boolean => {
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        role,
        yearOfStudy,
        course,
        courseUnits
    } = formData;

    return Boolean(
        firstName.trim() &&
            lastName.trim() &&
            email.trim() &&
            password.trim() &&
            confirmPassword.trim() &&
            role.trim() &&
            yearOfStudy !== undefined &&
            course.trim() &&
            courseUnits.length > 0
    );
};

const AddUserCard: React.FC<AddUserFormProps> = ({ onSave, onCancel }) => {
    const [formData, setFormData] =
        React.useState<SignUpFormData>(INITIAL_FORM_DATA);
    const dispatch = useDispatch();

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const target = e.target;
            const { name, value } = target;

            // Handle checkbox inputs
            if (
                target instanceof HTMLInputElement &&
                target.type === 'checkbox' &&
                name === 'courseUnits'
            ) {
                setFormData((prev) => ({
                    ...prev,
                    courseUnits: target.checked
                        ? [...prev.courseUnits, value]
                        : prev.courseUnits.filter((unit) => unit !== value)
                }));
                return;
            }

            // Handle all other inputs
            setFormData((prev) => ({ ...prev, [name]: value }));
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

            dispatch(signUpRequest(formData));
            onSave();
        },
        [dispatch, formData, onSave]
    );

    const handleBackgroundClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) {
                onCancel();
            }
        },
        [onCancel]
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

    const formProps = React.useMemo(
        () => ({
            formData,
            handleInputChange,
            handleSubmit,
            handleBack: onCancel,
            signUp: true as const
        }),
        [formData, handleInputChange, handleSubmit]
    );

    const CloseButton = React.memo(() => (
        <Button type="button" onClick={onCancel}>
            <img src={closeIcon} alt="Close" />
        </Button>
    ));

    return (
        <div className={styles.overlay} onClick={handleBackgroundClick}>
            <div
                className={styles.popupCard}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="add-user-title"
            >
                <div className={styles.closeIcon}>
                    <CloseButton />
                </div>
                <h2 id="add-user-title" className={styles.popupTitle}>
                    Add a New User
                </h2>
                <div className={styles.contentContainer}>
                    <SignUpForm {...formProps} />
                </div>
            </div>
        </div>
    );
};

export default React.memo(AddUserCard);
