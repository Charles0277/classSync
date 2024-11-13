import React from 'react';
import styles from '../Forms.module.css';
import Input from '../../Input/Input';

interface LogInFormProps {
    formData: {
        email: string;
        password: string;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    setMode: React.Dispatch<
        React.SetStateAction<'logIn' | 'signUp' | 'logInAsGuest' | undefined>
    >;
}

const LogInForm: React.FC<LogInFormProps> = ({
    formData,
    handleInputChange,
    handleSubmit,
    setMode
}) => (
    <>
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
                <Input
                    type="button"
                    id="back"
                    name="back"
                    value="Back"
                    onClick={() => setMode(undefined)}
                />
                <Input type="submit" id="logIn" name="logIn" value="Log in" />
            </div>
        </form>
    </>
);

export default LogInForm;
