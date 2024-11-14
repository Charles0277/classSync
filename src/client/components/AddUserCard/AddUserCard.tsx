import React, { useEffect, useState } from 'react';
import styles from './EditUserCard.module.css';
import { IUser } from '../../../common/types/IUser';
import Button from '../Button/Button';
import closeIcon from '../../assets/closeIcon.svg';
import SignUpForm from '../Forms/SignupForm/SignUpForm';
import { useDispatch, useSelector } from 'react-redux';
import { Types } from 'mongoose';
import { updateUserRequest } from '../../store/slices/userSlice';
import { RootState } from '../../store/store';

interface EditUserFormProps {
    user: IUser;
    onSave: () => void;
    onCancel: () => void;
}

interface SignUpFormData {
    firstName: string;
    lastName: string;
    email: string;
    course: string;
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
        course: user.course?.toString()
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(updateUserRequest({ formData, token }));
        onSave();
    };

    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Close the popup if clicking outside the popup card
        if (e.target === e.currentTarget) {
            onCancel();
        }
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
        <div className={styles.overlay} onClick={handleBackgroundClick}>
            <div
                className={styles.popupCard}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.closeIcon}>
                    <Button
                        type="button"
                        onClick={() => {
                            onCancel();
                        }}
                    >
                        <img src={closeIcon} />
                    </Button>
                </div>
                <h2 className={styles.popupTitle}>
                    Edit {user.firstName} {user.lastName}
                </h2>
                <SignUpForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default EditUserForm;
