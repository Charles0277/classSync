import React, { useEffect, useState } from 'react';
import Input from '../../Input/Input';
import styles from '../Forms.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCoursesRequest } from '../../../store/slices/courseSlice';
import { RootState } from '../../../store/store';
import { ICourseUnit } from '../../../../common/types/ICourseUnit';

const findFirstDigit = (input: string): string | null => {
    const match = input.match(/\d/); // Match the first single digit
    return match ? match[0] : null; // Return the digit as a string or null
};

interface SignUpFormProps {
    formData: {
        firstName: string;
        lastName: string;
        email: string;
        password?: string;
        confirmPassword?: string;
        role: 'student' | 'teacher';
        yearOfStudy: 1 | 2 | 3 | 4 | 5 | 6 | 7 | undefined;
        course: string;
        courseUnits: string[];
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
}) => {
    const { courses } = useSelector((state: RootState) => state.course);
    const dispatch = useDispatch();

    const [step, setStep] = useState(1); // Track the form step
    const [selectedCourseUnits, setSelectedCourseUnits] = useState<
        ICourseUnit[]
    >([]);

    useEffect(() => {
        if (!courses) {
            dispatch(fetchAllCoursesRequest());
        }
    }, [dispatch, courses]);

    useEffect(() => {
        if (formData.course) {
            const selectedCourse = courses?.find(
                (course) => course._id === formData.course
            );
            setSelectedCourseUnits(
                selectedCourse
                    ? (selectedCourse.courseUnits as ICourseUnit[])
                    : []
            );
        } else {
            setSelectedCourseUnits([]); // Clear course units if no course is selected
        }
    }, [formData.course, courses]);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();

        const { firstName, lastName, email, password, confirmPassword } =
            formData;

        // Check for missing or invalid fields
        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !email.trim() ||
            (password && !password.trim) ||
            (confirmPassword && !confirmPassword.trim)
        ) {
            alert('All fields are required. Please fill out all the fields.');
            return;
        }

        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    return (
        <div
            className={`${styles.formContainer} ${!signUp && styles.notSignUp}`}
        >
            {signUp && <h2 className={styles.formTitle}>Sign up</h2>}
            <form className={styles.formGroup} onSubmit={handleSubmit}>
                {step === 1 ? (
                    <>
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
                        <label htmlFor="confirmPassword">
                            Confirm password:
                        </label>
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
                        <div className={styles.actionButtonGroup}>
                            <Input
                                type="button"
                                id="back"
                                name="back"
                                value="Back"
                                onClick={() => setMode && setMode(undefined)}
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
                        <label htmlFor="role">Role:</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                            className={styles.select}
                        >
                            <option value="student" key="student">
                                Student
                            </option>
                            <option value="teacher" key="teacher">
                                Teacher
                            </option>
                        </select>

                        <label htmlFor="yearOfStudy">Year of Study:</label>
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
                            {Array.from({ length: 7 }, (_, index) => (
                                <option value={index + 1} key={index + 1}>
                                    {index + 1}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="course">Course:</label>
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
                            {courses &&
                                courses.map((course) => (
                                    <option
                                        value={course._id as string}
                                        key={course.code}
                                    >
                                        {course.name}
                                    </option>
                                ))}
                        </select>

                        <label htmlFor="courseUnits">Course Units:</label>
                        <div className={styles.checkBox}>
                            {formData.yearOfStudy &&
                                selectedCourseUnits
                                    .filter(
                                        (courseUnit) =>
                                            findFirstDigit(courseUnit.code) ===
                                            formData.yearOfStudy!.toString()
                                    )
                                    .map((courseUnit) => (
                                        <div key={courseUnit.code}>
                                            <input
                                                type="checkbox"
                                                id={courseUnit.code}
                                                name="courseUnits"
                                                value={courseUnit._id as string}
                                                onChange={handleInputChange}
                                                disabled={
                                                    formData.course === ''
                                                }
                                            />
                                            <label htmlFor={courseUnit.code}>
                                                {courseUnit.name}
                                            </label>
                                        </div>
                                    ))}
                        </div>
                        <div className={styles.actionButtonGroup}>
                            <Input
                                type="button"
                                id="previous"
                                name="previous"
                                value="Previous"
                                onClick={handleBack}
                            />
                            <Input
                                type="submit"
                                id="signUp"
                                name="signUp"
                                value="Sign Up"
                            />
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default SignUpForm;
