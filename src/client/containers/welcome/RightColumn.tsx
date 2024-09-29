import React, { useEffect, useState } from 'react';
import styles from './Welcome.module.css';
import { SHA256 } from 'crypto-js';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { useAuth0 } from '@auth0/auth0-react';

type Mode = 'logIn' | 'signUp' | 'logInAsGuest' | undefined;

interface ButtonConfig {
    text: string;
    mode: Mode;
}

interface SignUpFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const buttons: ButtonConfig[] = [
    { text: 'Log in', mode: 'logIn' },
    { text: 'Create account', mode: 'signUp' },
    { text: 'Log in as guest', mode: 'logInAsGuest' }
];

const RightColumn: React.FC = () => {
    const { loginWithRedirect } = useAuth0();

    const [mode, setMode] = useState<Mode>(undefined);
    const [formData, setFormData] = useState<SignUpFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        switch (mode) {
            case 'logIn':
                loginWithRedirect();
                break;
            case 'signUp':
                loginWithRedirect({
                    authorizationParams: {
                        screen_hint: 'signup'
                    }
                });
                break;
            case 'logInAsGuest':
                console.log('logInAsGuest');
                break;
        }
    }, [mode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(e.target);
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // SHA256(formData.password)
        // console.log("🚀 ~ SHA256(formData.password):", SHA256(formData.password))

        console.log('Form submitted with data:', formData);
        // TODO: Add your API call here
    };

    const renderGetStarted = () => (
        <>
            <h2 className={styles.greySectionTitle}>Get started</h2>
            {buttons.map(({ mode, text }, index) => (
                <button
                    key={index}
                    className={styles.button}
                    type="button"
                    onClick={() => setMode(mode)}
                >
                    {text}
                </button>
            ))}
        </>
    );

    const renderLogInForm = () => (
        <>
            <h2 className={styles.greySectionTitle}>Log in</h2>
            <form className={styles.formGroup}>
                <label htmlFor="email">Email:</label>
                <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                />
                <label htmlFor="password">Password:</label>
                <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                />
                <div className={styles.actionButtonGroup}>
                    <Input
                        type="button"
                        id="back"
                        name="back"
                        value="Back"
                        onClick={() => {
                            setMode(undefined);
                        }}
                    />
                    <Input
                        type="submit"
                        id="logIn"
                        name="logIn"
                        value="Log in"
                    />
                </div>
            </form>
        </>
    );

    const renderSignUpForm = () => (
        <>
            <h2 className={styles.greySectionTitle}>Sign up</h2>
            <form className={styles.formGroup} onSubmit={handleSubmit}>
                <label htmlFor="firstName">First name:</label>
                <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                />
                <label htmlFor="lastName">Last name:</label>
                <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                />
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
                <label htmlFor="confirmPassword">Confirm password:</label>
                <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                />
                <div className={styles.actionButtonGroup}>
                    <Button
                        size="small"
                        type="button"
                        color="#CC4B4B"
                        onClick={() => setMode(undefined)}
                    >
                        Back
                    </Button>
                    <Button size="small" type="submit" color="#3CB371">
                        Sign up
                    </Button>
                </div>
            </form>
        </>
    );

    const renderContent = () => {
        switch (mode) {
            // case 'logIn':
            //     return renderLogInForm();
            // case 'signUp':
            //     return renderSignUpForm();
            default:
                return renderGetStarted();
        }
    };

    return (
        <section className={styles.rightColumn}>
            <div className={styles.greySection}>{renderContent()}</div>
        </section>
    );
};

export default RightColumn;
