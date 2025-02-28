import React from 'react';
import styles from '../Forms.module.css';
import Input from '../../Input/Input';
import Button from '../../Button/Button';

interface LogInFormProps {
    formData: {
        email: string;
        password: string;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    setMode: React.Dispatch<
        React.SetStateAction<'logIn' | 'signUp' | undefined>
    >;
    loggingIn: boolean;
    isFormValid: boolean;
}

const LogInForm: React.FC<LogInFormProps> = ({
    formData,
    handleInputChange,
    handleSubmit,
    setMode,
    loggingIn,
    isFormValid
}) => (
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
                onChange={handleInputChange}
            />
            <label htmlFor="password">Password:</label>
            <Input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
            />
            <div className={styles.actionButtonGroup}>
                <div className={styles.actionButtonGroup}>
                    <Button
                        type="button" // Explicitly set to prevent form submission
                        onClick={() => setMode(undefined)}
                        className="back"
                    >
                        Back
                    </Button>
                    <Button
                        type="submit" // This will trigger form submission
                        disabled={!isFormValid}
                        loading={loggingIn}
                        className="logIn"
                    >
                        {loggingIn ? 'Logging In...' : 'Log In'}
                    </Button>
                </div>
            </div>
        </form>
    </div>
);

export default LogInForm;
