import { setMode } from '@/client/store/slices/authSlice';
import { RootState } from '@/client/store/store';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import styles from '../Forms.module.css';

interface LogInFormProps {
    formData: {
        email: string;
        password: string;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    loggingIn: boolean;
    isFormValid: boolean;
}

export const LogInForm: React.FC<LogInFormProps> = ({
    formData,
    handleInputChange,
    handleSubmit,
    loggingIn,
    isFormValid
}) => {
    const { error } = useSelector((state: RootState) => state.auth);
    const [showError, setShowError] = useState(false);
    const dispatch = useDispatch();

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Log in</h2>
            <form className={styles.formGroup} onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => {
                        handleInputChange(e);
                        setShowError(false);
                    }}
                />
                <label htmlFor="password">Password:</label>
                <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => {
                        handleInputChange(e);
                        setShowError(false);
                    }}
                />
                {error && showError && (
                    <span className={styles.errorMessage}>{error}</span>
                )}
                <div className={styles.actionButtonGroup}>
                    <Button
                        type="button"
                        onClick={() => dispatch(setMode(undefined))}
                        className="back"
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        disabled={!isFormValid}
                        loading={loggingIn}
                        className="logIn"
                        onClick={() => setShowError(true)}
                    >
                        {loggingIn ? 'Logging In...' : 'Log In'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
