import React, { useEffect, useState } from 'react';
import styles from './Welcome.module.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { logInRequest, signUpRequest } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';
import SignUpForm from '../../components/Forms/SignupForm/SignUpForm';
import LogInForm from '../../components/Forms/LogInForm/LogInForm';

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
    role: 'student' | 'teacher';
    yearOfStudy: 1 | 2 | 3 | 4 | 5 | 6 | 7 | undefined;
    course: string;
    courseUnits: string[];
}

const buttons: ButtonConfig[] = [
    { text: 'Log in', mode: 'logIn' },
    { text: 'Create account', mode: 'signUp' },
    { text: 'Log in as guest', mode: 'logInAsGuest' }
];

const RightColumn: React.FC = () => {
    const [mode, setMode] = useState<Mode>(undefined);
    const [formData, setFormData] = useState<SignUpFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
        yearOfStudy: undefined,
        course: '',
        courseUnits: []
    });

    const dispatch = useDispatch();
    const { user, token, isAuthenticated, isLoading } = useSelector(
        (state: RootState) => state.auth
    );

    useEffect(() => {
        if (user && token && isAuthenticated) {
            localStorage.setItem('token', token);
        }
    }, [user, token, isAuthenticated]);

    useEffect(() => {
        switch (mode) {
            case 'logIn':
                console.log('log in');
                break;
            case 'signUp':
                console.log('signUp');
                break;
            case 'logInAsGuest':
                console.log('logInAsGuest');
                break;
        }
    }, [mode]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        // Type guard for checkbox inputs
        if (
            type === 'checkbox' &&
            name === 'courseUnits' &&
            e.target instanceof HTMLInputElement
        ) {
            const checked = e.target.checked;

            setFormData((prevState) => {
                const currentUnits = prevState.courseUnits || [];
                const updatedUnits = checked
                    ? [...currentUnits, value] // Add value if checked
                    : currentUnits.filter((unit) => unit !== value); // Remove value if unchecked

                return {
                    ...prevState,
                    courseUnits: updatedUnits
                };
            });
        } else {
            // Default handling for other inputs
            setFormData((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Form submitted with data:', formData);

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

        // Check for missing or invalid fields
        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !email.trim() ||
            !password.trim() ||
            !confirmPassword.trim() ||
            !role.trim() ||
            yearOfStudy === undefined ||
            !course.trim() ||
            courseUnits.length === 0
        ) {
            alert('All fields are required. Please fill out all the fields.');
            return;
        }

        mode === 'logIn'
            ? dispatch(logInRequest(formData))
            : dispatch(signUpRequest(formData));
    };

    const renderGetStarted = () => (
        <>
            <h2 className={styles.greySectionTitle}>Get started</h2>
            {buttons.map(({ mode, text }, index) => (
                <Button
                    key={index}
                    className="getStarted"
                    type="button"
                    onClick={() => setMode(mode)}
                >
                    {text}
                </Button>
            ))}
        </>
    );

    const renderContent = () => {
        switch (mode) {
            case 'logIn':
                return (
                    <LogInForm
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        setMode={setMode}
                    />
                );
            case 'signUp':
                return (
                    <SignUpForm
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        setMode={setMode}
                        signUp
                    />
                );
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
