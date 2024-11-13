import React from 'react';
import Input from '../../Input/Input';
import styles from '../Forms.module.css';

interface SignUpFormProps {
    formData: {
        firstName: string;
        lastName: string;
        email: string;
        password?: string;
        confirmPassword?: string;
        course?: string;
    };
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    handleSubmit: (e: React.FormEvent) => void;
    setMode?: React.Dispatch<
        React.SetStateAction<'logIn' | 'signUp' | 'logInAsGuest' | undefined>
    >;
    signUp?: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
    formData,
    handleInputChange,
    handleSubmit,
    setMode,
    signUp
}) => (
    <div className={`${styles.formContainer} ${!signUp && styles.notSignUp}`}>
        {signUp && <h2 className={styles.formTitle}>Sign up</h2>}
        <form className={styles.formGroup} onSubmit={handleSubmit}>
            <label htmlFor="firstName">First name:</label>
            <Input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                minLength={2}
                maxLength={50}
                pattern={'^[a-zA-Z]+$'}
                title={
                    'Please enter a valid name (letters only, 2-50 characters)'
                }
            />
            <label htmlFor="lastName">Last name:</label>
            <Input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                minLength={2}
                maxLength={50}
                pattern={'^[a-zA-Z]+$'}
                title={
                    'Please enter a valid name (letters only, 2-50 characters)'
                }
            />
            <label htmlFor="email">Email:</label>
            <Input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                pattern={/^[^@\s]+@[^@\s]+\.[^@\s]+$/.source}
                title={'Please enter a valid email address.'}
            />
            <label htmlFor="course">Course:</label>
            <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                required
                className={styles.select}
            >
                <option value="Computer Science">Computer Science</option>
                <option value="Maths">Maths</option>
                <option value="Engineering">Engineering</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Maths">Maths</option>
                <option value="Engineering">Engineering</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Maths">Maths</option>
                <option value="Engineering">Engineering</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Maths">Maths</option>
                <option value="Engineering">Engineering</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Maths">Maths</option>
                <option value="Engineering">Engineering</option>
            </select>
            {signUp && (
                <>
                    <label htmlFor="password">Password:</label>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        pattern={
                            '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}'
                        }
                        title={
                            'Password must be at least 8 characters, include an uppercase letter, a number, and a special character.'
                        }
                    />
                    <label htmlFor="confirmPassword">Confirm password:</label>
                    <Input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        pattern={`${formData.password}`}
                    />
                </>
            )}
            <div className={styles.actionButtonGroup}>
                {signUp ? (
                    <>
                        <Input
                            type="button"
                            id="back"
                            name="back"
                            value="Back"
                            onClick={() => setMode && setMode(undefined)}
                        />
                        <Input
                            type="submit"
                            id="signUp"
                            name="signUp"
                            value="Sign Up"
                        />
                    </>
                ) : (
                    <Input type="submit" id="save" name="save" value="Save" />
                )}
            </div>
        </form>
    </div>
);

export default SignUpForm;
