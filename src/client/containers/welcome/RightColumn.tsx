import { LogInForm } from '@/client/components/Forms/LogInForm/LogInForm';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/Button/Button';
import SignUpForm from '../../components/Forms/SignupForm/SignUpForm';
import {
    logInRequest,
    setMode,
    signUpRequest
} from '../../store/slices/authSlice';
import { RootState } from '../../store/store';
import styles from './Welcome.module.css';

type Mode = 'logIn' | 'signUp' | undefined;

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
    { text: 'Create account', mode: 'signUp' }
] as const;

const RightColumn: React.FC = () => {
    const [formData, setFormData] = useState<SignUpFormData>(INITIAL_FORM_DATA);
    const dispatch = useDispatch();

    const { user, token, isAuthenticated, loggingIn, signingUp, mode } =
        useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (user && token && isAuthenticated) {
            localStorage.setItem('token', token);
        }
    }, [user, token, isAuthenticated]);

    const isFormValid = useMemo(() => {
        if (mode === 'signUp') {
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
                firstName.trim() !== '' &&
                lastName.trim() !== '' &&
                email.trim() !== '' &&
                password.trim() !== '' &&
                confirmPassword.trim() !== '' &&
                role.trim() !== '' &&
                yearOfStudy !== undefined &&
                course.trim() !== '' &&
                courseUnits.length > 0
            );
        } else if (mode === 'logIn') {
            const { email, password } = formData;
            return email.trim() !== '' && password.trim() !== '';
        }
        return false;
    }, [formData, mode]);

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
            } else {
                setFormData((prev) => ({ ...prev, [name]: value }));
            }
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

            if (mode === 'logIn') {
                dispatch(logInRequest(formData));
            } else if (mode === 'signUp') {
                dispatch(signUpRequest(formData));
            }
        },
        [dispatch, formData, isFormValid, mode]
    );

    const GetStartedSection = useMemo(
        () => (
            <>
                <h2 className={styles.greySectionTitle}>Get started</h2>
                {BUTTONS.map(({ mode: buttonMode, text }) => (
                    <div className={styles.buttonContainer} key={text}>
                        <Button
                            type="button"
                            className="getStarted"
                            onClick={() => dispatch(setMode(buttonMode))}
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
            loggingIn,
            signingUp,
            isFormValid
        };

        if (mode === 'logIn') {
            return <LogInForm {...props} />;
        } else if (mode === 'signUp') {
            return <SignUpForm {...props} mode="signUp" />;
        }
        return GetStartedSection;
    }, [mode, formData, handleInputChange, handleSubmit, GetStartedSection]);

    return (
        <section className={styles.rightColumn}>
            <div className={styles.greySection}>{renderContent}</div>
        </section>
    );
};

export default React.memo(RightColumn);
