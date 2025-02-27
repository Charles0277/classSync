import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/Button/Button';
import LogInForm from '../../components/Forms/LogInForm/LogInForm';
import SignUpForm from '../../components/Forms/SignupForm/SignUpForm';
import { logInRequest, signUpRequest } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';
import styles from './Welcome.module.css';

// Move types to separate file (e.g., types.ts)
type Mode = 'logIn' | 'signUp' | 'logInAsGuest' | undefined;

interface ButtonConfig {
    text: string;
    mode: Mode;
}

export interface SignUpFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'student' | 'teacher';
    yearOfStudy: 1 | 2 | 3 | 4 | 5 | 7 | undefined;
    course: string;
    courseUnits: string[];
}

// Constants moved outside component
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
};

const BUTTONS: ButtonConfig[] = [
    { text: 'Log in', mode: 'logIn' },
    { text: 'Create account', mode: 'signUp' },
    { text: 'Log in as guest', mode: 'logInAsGuest' }
] as const;

const RightColumn: React.FC = () => {
    const [mode, setMode] = useState<Mode>(undefined);
    const [formData, setFormData] = useState<SignUpFormData>(INITIAL_FORM_DATA);

    const dispatch = useDispatch();
    const { user, token, isAuthenticated } = useSelector(
        (state: RootState) => state.auth
    );

    // Handle token storage
    useEffect(() => {
        if (user && token && isAuthenticated) {
            localStorage.setItem('token', token);
        }
    }, [user, token, isAuthenticated]);

    // Memoized form validation
    const isFormValid = useMemo(() => {
        if (mode !== 'signUp') return true;

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

        return (
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
    }, [formData, mode]);

    // Memoized handlers
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value, type } = e.target;

            if (
                type === 'checkbox' &&
                name === 'courseUnits' &&
                e.target instanceof HTMLInputElement
            ) {
                const checked = e.target.checked;
                setFormData((prev) => ({
                    ...prev,
                    courseUnits: checked
                        ? [...prev.courseUnits, value]
                        : prev.courseUnits.filter((unit) => unit !== value)
                }));
                return;
            }

            setFormData((prev) => ({ ...prev, [name]: value }));
        },
        []
    );

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();

            if (!isFormValid) {
                alert(
                    'All fields are required. Please fill out all the fields.'
                );
                return;
            }

            dispatch(
                mode === 'logIn'
                    ? logInRequest(formData)
                    : signUpRequest(formData)
            );
        },
        [dispatch, formData, isFormValid, mode]
    );

    // Memoized components
    const GetStartedSection = useMemo(
        () => (
            <>
                <h2 className={styles.greySectionTitle}>Get started</h2>
                {BUTTONS.map(({ mode: buttonMode, text }) => (
                    <div className={styles.buttonContainer} key={text}>
                        <Button
                            key={text}
                            className="getStarted"
                            type="button"
                            onClick={() => setMode(buttonMode)}
                        >
                            {text}
                        </Button>
                    </div>
                ))}
            </>
        ),
        []
    );

    const renderContent = useMemo(() => {
        const props = {
            formData,
            handleInputChange,
            handleSubmit,
            setMode
        };

        switch (mode) {
            case 'logIn':
                return <LogInForm {...props} />;
            case 'signUp':
                return <SignUpForm {...props} mode="signUp" />;
            default:
                return GetStartedSection;
        }
    }, [mode, formData, handleInputChange, handleSubmit, GetStartedSection]);

    return (
        <section className={styles.rightColumn}>
            <div className={styles.greySection}>{renderContent}</div>
        </section>
    );
};

export default memo(RightColumn);
