import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../Input/Input';
import styles from '../Forms.module.css';
import { fetchAllCoursesRequest } from '../../../store/slices/courseSlice';
import { RootState } from '../../../store/store';
import { ICourseUnit } from '../../../../common/types/ICourseUnit';
import { ICourse } from '../../../../common/types/ICourse';

// Separate types into their own interfaces
interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    confirmPassword?: string;
    role: 'student' | 'teacher';
    yearOfStudy: 1 | 2 | 3 | 4 | 5 | 6 | 7 | undefined;
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
}

// Extract form validation logic
const validateForm = (formData: FormData, signUp: boolean): string | null => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
        return 'All fields are required';
    }

    if (signUp && (!password?.trim() || !confirmPassword?.trim())) {
        return 'Password fields are required';
    }

    return null;
};

// Extract utility functions
const findFirstDigit = (input: string): string | null => {
    const match = input.match(/\d/);
    return match?.[0] || null;
};

// Create reusable form field components
const FormField: React.FC<{
    label: string;
    children: React.ReactNode;
}> = ({ label, children }) => (
    <>
        <label>{label}:</label>
        {children}
    </>
);

const SignUpForm: React.FC<SignUpFormProps> = ({
    formData,
    handleInputChange,
    handleSubmit,
    setMode,
    signUp = false,
    handleBack
}) => {
    const [step, setStep] = useState(1);
    const dispatch = useDispatch();

    const { courses } = useSelector((state: RootState) => state.course);

    // Memoize selected course units computation
    const selectedCourseUnits = useMemo(() => {
        if (!formData.course || !courses) return [];
        const selectedCourse = courses.find(
            (course: ICourse) => course._id === formData.course
        );
        return selectedCourse
            ? (selectedCourse.courseUnits as ICourseUnit[])
            : [];
    }, [formData.course, courses]);

    // Memoize filtered course units
    const filteredCourseUnits = useMemo(() => {
        if (!formData.yearOfStudy) return [];
        return selectedCourseUnits.filter(
            (courseUnit) =>
                findFirstDigit(courseUnit.code) ===
                formData.yearOfStudy!.toString()
        );
    }, [selectedCourseUnits, formData.yearOfStudy]);

    // Use callbacks for event handlers
    const handleNext = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            const error = validateForm(formData, signUp);
            if (error) {
                alert(error);
                return;
            }
            setStep(2);
        },
        [formData, signUp]
    );

    const handlePrevious = useCallback(() => setStep(1), []);

    const handleBackClick = useCallback(() => {
        if (setMode) {
            setMode(undefined);
        } else if (handleBack) {
            handleBack();
        }
    }, [setMode, handleBack]);

    // Fetch courses on mount
    useEffect(() => {
        if (courses.length === 0) {
            dispatch(fetchAllCoursesRequest());
        }
    }, [dispatch, courses]);

    // Split form into separate components
    const PersonalInfoFields = (
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

            {signUp && (
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
                            title="Password must be at least 8 characters, include an uppercase letter, a number, and a special character."
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
                            pattern={`${formData.password}`}
                        />
                    </FormField>
                </>
            )}
        </>
    );

    const AcademicInfoFields = (
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
                    {Array.from({ length: 7 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1}
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
                    {courses?.map((course) => (
                        <option key={course.code} value={course._id as string}>
                            {course.name}
                        </option>
                    ))}
                </select>
            </FormField>

            <FormField label="Course Units">
                <div className={styles.checkBox}>
                    {filteredCourseUnits.map((courseUnit) => (
                        <div key={courseUnit.code}>
                            <input
                                type="checkbox"
                                id={courseUnit.code}
                                name="courseUnits"
                                value={courseUnit._id as string}
                                onChange={handleInputChange}
                                disabled={!formData.course}
                                defaultChecked={formData.courseUnits.includes(
                                    courseUnit._id as string
                                )}
                            />
                            <label htmlFor={courseUnit.code}>
                                {courseUnit.name}
                            </label>
                        </div>
                    ))}
                </div>
            </FormField>
        </>
    );

    return (
        <div
            className={`${styles.formContainer} ${!signUp && styles.notSignUp}`}
        >
            {signUp && setMode && <h2 className={styles.formTitle}>Sign up</h2>}
            <form className={styles.formGroup} onSubmit={handleSubmit}>
                {step === 1 ? (
                    <>
                        {PersonalInfoFields}
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
                                style={{ backgroundColor: 'green' }}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        {AcademicInfoFields}
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
                                value={signUp ? 'Sign Up' : 'Save'}
                            />
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default SignUpForm;
