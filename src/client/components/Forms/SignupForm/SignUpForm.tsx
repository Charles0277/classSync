import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ICourseUnit } from '../../../../common/types/ICourseUnit';
import { findFirstDigit } from '../../../../common/utils';
import { fetchAllCoursesRequest } from '../../../store/slices/courseSlice';
import { RootState } from '../../../store/store';
import Input from '../../Input/Input';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '../../ui/alert-dialog';
import styles from '../Forms.module.css';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    confirmPassword?: string;
    role: 'student' | 'teacher';
    yearOfStudy: 1 | 2 | 3 | 4 | 5 | 7 | undefined;
    course: string;
    courseUnits: string[];
}

interface SignUpFormProps {
    formData: FormData;
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    handleSubmit: (e: React.FormEvent) => void;
    setMode?: React.Dispatch<
        React.SetStateAction<'logIn' | 'signUp' | 'logInAsGuest' | undefined>
    >;
    signUp?: boolean;
    handleBack?: () => void;
    mode: 'signUp' | 'edit' | 'admin';
}

const validateForm = (
    formData: FormData,
    mode: 'signUp' | 'edit' | 'admin',
    setDialogMessage: React.Dispatch<React.SetStateAction<string>>,
    setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>
): boolean => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
        setDialogMessage('All fields are required');
        setDialogVisible(true);
        return false;
    }

    if (mode === 'signUp' && (!password?.trim() || !confirmPassword?.trim())) {
        setDialogMessage('Password fields are required');
        setDialogVisible(true);
        return false;
    }

    return true;
};

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({
    label,
    children
}) => (
    <div className={styles.formField}>
        <label>{label}:</label>
        {children}
    </div>
);

const SignUpForm: React.FC<SignUpFormProps> = ({
    formData,
    handleInputChange,
    handleSubmit,
    setMode,
    mode,
    handleBack
}) => {
    const [step, setStep] = useState(1);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const dispatch = useDispatch();
    const { courses } = useSelector((state: RootState) => state.course);

    const selectedCourseUnits = useMemo(() => {
        if (!formData.course || !courses) return [];
        const selectedCourse = courses.find(
            (course) => course._id === formData.course
        );
        return selectedCourse ? selectedCourse.courseUnits || [] : [];
    }, [formData.course, courses]);

    const filteredCourseUnits = useMemo(() => {
        if (!formData.yearOfStudy) return [];
        return selectedCourseUnits.filter(
            (courseUnit) =>
                findFirstDigit((courseUnit as ICourseUnit).code) ===
                (formData.yearOfStudy ?? '').toString()
        );
    }, [selectedCourseUnits, formData.yearOfStudy]);

    const handleNext = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            const isValid = validateForm(
                formData,
                mode,
                setDialogMessage,
                setDialogVisible
            );

            if (!isValid) return;

            if (
                (mode === 'signUp' || mode === 'edit') &&
                formData.password !== formData.confirmPassword
            ) {
                setDialogMessage('Passwords do not match');
                setDialogVisible(true);
                return;
            }

            setStep(2);
        },
        [formData, mode]
    );

    const handlePrevious = useCallback(() => setStep(1), []);
    const handleBackClick = useCallback(() => {
        if (setMode) setMode(undefined);
        else handleBack?.();
    }, [setMode, handleBack]);

    useEffect(() => {
        if (!courses.length) {
            dispatch(fetchAllCoursesRequest());
        }
    }, [dispatch, courses]);

    const renderPersonalInfoFields = () => (
        <>
            <FormField label="First name">
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
                    pattern="^[a-zA-Z]+$"
                    title="Please enter a valid name (letters only, 2-50 characters)"
                />
            </FormField>
            <FormField label="Last name">
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
                    pattern="^[a-zA-Z]+$"
                    title="Please enter a valid name (letters only, 2-50 characters)"
                />
            </FormField>
            <FormField label="Email">
                <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    pattern={/^[^@\s]+@[^@\s]+\.[^@\s]+$/.source}
                    title="Please enter a valid email address."
                />
            </FormField>
            {(mode === 'signUp' || mode === 'edit') && (
                <>
                    <FormField label="Password">
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}"
                            title="Password must be at least 8 characters, include uppercase, number, and special character."
                        />
                    </FormField>
                    <FormField label="Confirm password">
                        <Input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                        />
                    </FormField>
                </>
            )}
        </>
    );

    const renderAcademicInfoFields = () => (
        <>
            <FormField label="Role">
                <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className={styles.select}
                >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
            </FormField>
            <FormField label="Year of Study">
                <select
                    id="yearOfStudy"
                    name="yearOfStudy"
                    value={formData.yearOfStudy || ''}
                    onChange={handleInputChange}
                    required
                    className={styles.select}
                >
                    <option value="" disabled>
                        Select a Year of Study
                    </option>
                    {[1, 2, 3, 4, 5, 7].map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </FormField>
            <FormField label="Course">
                <select
                    id="course"
                    name="course"
                    value={formData.course || ''}
                    onChange={handleInputChange}
                    required
                    className={styles.select}
                >
                    <option value="" disabled>
                        Select a course
                    </option>
                    {courses.map((course) => (
                        <option
                            key={course._id as string}
                            value={course._id as string}
                        >
                            {course.name}
                        </option>
                    ))}
                </select>
            </FormField>
            <FormField label="Course Units">
                <div className={styles.checkBox}>
                    {filteredCourseUnits.map((courseUnit) => (
                        <div key={courseUnit._id as string}>
                            <input
                                type="checkbox"
                                id={courseUnit._id as string}
                                name="courseUnits"
                                value={courseUnit._id as string}
                                onChange={handleInputChange}
                                disabled={!formData.course}
                                defaultChecked={formData.courseUnits.includes(
                                    courseUnit._id as string
                                )}
                            />
                            <label htmlFor={courseUnit._id as string}>
                                {(courseUnit as ICourseUnit).name}
                            </label>
                        </div>
                    ))}
                </div>
            </FormField>
        </>
    );

    return (
        <div
            className={`${styles.formContainer} ${mode === 'admin' && styles.notSignUp}`}
        >
            {mode === 'signUp' && setMode && (
                <h2 className={styles.formTitle}>Sign Up</h2>
            )}
            <form className={styles.formGroup} onSubmit={handleSubmit}>
                <AlertDialog
                    open={dialogVisible}
                    onOpenChange={setDialogVisible}
                >
                    <AlertDialogTrigger asChild>
                        <div style={{ display: 'none' }} />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Validation Error
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {dialogMessage}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction
                                onClick={() => setDialogVisible(false)}
                            >
                                OK
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                {step === 1 ? (
                    <>
                        {renderPersonalInfoFields()}
                        <div className={styles.actionButtonGroup}>
                            <Input
                                type="button"
                                id="back"
                                name="back"
                                value="Back"
                                onClick={handleBackClick}
                            />
                            <Input
                                type="button"
                                id="next"
                                name="next"
                                value="Next"
                                onClick={handleNext}
                                style={{ backgroundColor: '#28a745' }}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        {renderAcademicInfoFields()}
                        <div className={styles.actionButtonGroup}>
                            <Input
                                type="button"
                                id="previous"
                                name="previous"
                                value="Previous"
                                onClick={handlePrevious}
                            />
                            <Input
                                type="submit"
                                id="signUp"
                                name="signUp"
                                value={mode === 'signUp' ? 'Sign Up' : 'Save'}
                            />
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default SignUpForm;
