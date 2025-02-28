import { setMode } from '@/client/store/slices/authSlice';
import { MANCHESTER_EMAIL_REGEX } from '@/common/validation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { ICourseUnit } from '../../../../common/types/ICourseUnit';
import { findFirstDigit, getIdString } from '../../../../common/utils';
import { fetchAllCoursesRequest } from '../../../store/slices/courseSlice';
import { RootState } from '../../../store/store';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import styles from '../Forms.module.css';

// Type definitions
type UserRole = 'student' | 'teacher';
type StudyYear = 1 | 2 | 3 | 4 | 5 | 7;

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    confirmPassword?: string;
    role: UserRole;
    yearOfStudy?: StudyYear;
    course: string;
    courseUnits: string[];
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

type FormMode = 'signUp' | 'edit' | 'admin';

interface SignUpFormProps {
    formData: FormData;
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    handleSubmit: (e: React.FormEvent) => void;
    mode: FormMode;
    signingUp: boolean;
    isFormValid: boolean;
}

// Form Field component
const FormField: React.FC<{
    label: string;
    children: React.ReactNode;
    error?: string;
    showError?: boolean;
}> = ({ label, children, error, showError }) => (
    <div className={styles.formField}>
        <label>{label}:</label>
        {children}
        {error && showError && (
            <span className={styles.errorMessage}>{error}</span>
        )}
    </div>
);

// Custom hook for course data
const useCourseData = (selectedCourseId: string) => {
    const dispatch = useDispatch();
    const { courses } = useSelector((state: RootState) => state.course);

    useEffect(() => {
        if (!courses.length) {
            dispatch(fetchAllCoursesRequest());
        }
    }, [dispatch, courses.length]);

    const { selectedCourseUnits, courseOptions } = useMemo(() => {
        const selectedCourse = courses.find(
            (course) => getIdString(course._id) === selectedCourseId
        );
        return {
            selectedCourseUnits: selectedCourse?.courseUnits || [],
            courseOptions: courses.map((course) => ({
                value: getIdString(course._id),
                label: course.name
            }))
        };
    }, [courses, selectedCourseId]);

    return { selectedCourseUnits, courseOptions };
};

const SignUpForm: React.FC<SignUpFormProps> = ({
    formData,
    handleInputChange,
    handleSubmit,
    mode,
    signingUp,
    isFormValid
}) => {
    const [step, setStep] = useState(1);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const { error } = useSelector((state: RootState) => state.auth);
    const [showError, setShowError] = useState(false);
    const [showResponseError, setShowResponseError] = useState(false);
    const { selectedCourseUnits, courseOptions } = useCourseData(
        formData.course
    );

    const dispatch = useDispatch();
    // Derived data
    const filteredCourseUnits = useMemo(() => {
        if (!formData.yearOfStudy) return [];
        return selectedCourseUnits.filter(
            (unit) =>
                findFirstDigit((unit as ICourseUnit).code) ===
                String(formData.yearOfStudy)
        );
    }, [selectedCourseUnits, formData.yearOfStudy]);

    const courseUnitOptions = useMemo(
        () =>
            filteredCourseUnits.map((unit) => ({
                value: getIdString(unit._id),
                label: (unit as ICourseUnit).name
            })),
        [filteredCourseUnits]
    );

    const selectedCourseUnitOptions = useMemo(
        () =>
            courseUnitOptions.filter((opt) =>
                formData.courseUnits.includes(opt.value)
            ),
        [courseUnitOptions, formData.courseUnits]
    );

    // Validation logic
    const validateFields = useCallback(() => {
        const errors: FormErrors = {};
        const { firstName, lastName, email, password, confirmPassword } =
            formData;

        // Name validations
        const validateName = (name: string, field: keyof FormErrors) => {
            if (!name.trim()) {
                errors[field] = 'This field is required';
            } else if (!/^[a-zA-Z]+$/.test(name)) {
                errors[field] = 'Only letters are allowed';
            } else if (name.length < 2 || name.length > 50) {
                errors[field] = 'Length must be between 2 and 50 characters';
            }
        };

        validateName(firstName, 'firstName');
        validateName(lastName, 'lastName');

        // Email validation
        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!MANCHESTER_EMAIL_REGEX.test(email)) {
            errors.email =
                'Must be a valid University of Manchester email address';
        }

        // Password validation
        if (mode !== 'admin') {
            if (!password) {
                errors.password = 'Password is required';
            } else if (
                !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}/.test(
                    password
                )
            ) {
                errors.password =
                    'Password must contain at least 8 characters, including uppercase, number, and special character';
            }

            if (!confirmPassword) {
                errors.confirmPassword = 'Please confirm your password';
            } else if (confirmPassword !== password) {
                errors.confirmPassword = 'Passwords do not match';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData, mode]);

    useEffect(() => {
        validateFields();
    }, [validateFields]);

    // Form handlers
    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateFields()) {
            setStep(2);
            setShowError(false);
        } else setShowError(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateFields()) {
            handleSubmit(e);
            setShowError(false);
        } else setShowError(true);
    };

    const handleCourseUnitsChange = (selected: any) => {
        const values = selected.map((opt: any) => opt.value);
        handleInputChange({
            target: { name: 'courseUnits', value: values }
        } as React.ChangeEvent<HTMLSelectElement>);
    };

    // Form sections
    const renderPersonalInfo = () => (
        <>
            <FormField
                label="First name"
                error={formErrors.firstName}
                showError={showError}
            >
                <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) => {
                        handleInputChange(e);
                        setShowResponseError(false);
                    }}
                    required
                    minLength={2}
                    maxLength={50}
                    pattern="^[a-zA-Z]+$"
                />
            </FormField>
            <FormField
                label="Last name"
                error={formErrors.lastName}
                showError={showError}
            >
                <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) => {
                        handleInputChange(e);
                        setShowResponseError(false);
                    }}
                    required
                    minLength={2}
                    maxLength={50}
                    pattern="^[a-zA-Z]+$"
                />
            </FormField>
            <FormField
                label="Email"
                error={formErrors.email}
                showError={showError}
            >
                <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => {
                        handleInputChange(e);
                        setShowResponseError(false);
                    }}
                    required
                />
            </FormField>
            {(mode === 'signUp' || mode === 'edit') && (
                <>
                    <FormField
                        label="Password"
                        error={formErrors.password}
                        showError={showError}
                    >
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={(e) => {
                                handleInputChange(e);
                                setShowResponseError(false);
                            }}
                            required
                        />
                    </FormField>
                    <FormField
                        label="Confirm password"
                        error={formErrors.confirmPassword}
                        showError={showError}
                    >
                        <Input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => {
                                handleInputChange(e);
                                setShowResponseError(false);
                            }}
                            required
                        />
                    </FormField>
                </>
            )}
        </>
    );

    const renderAcademicInfo = () => (
        <>
            <FormField label="Role" showError={showError}>
                <select
                    name="role"
                    value={formData.role}
                    onChange={(e) => {
                        handleInputChange(e);
                        setShowResponseError(false);
                    }}
                    className={styles.select}
                    required
                >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
            </FormField>
            <FormField label="Year of Study" showError={showError}>
                <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy || ''}
                    onChange={(e) => {
                        handleInputChange(e);
                        setShowResponseError(false);
                    }}
                    className={styles.select}
                    required
                >
                    <option value="" disabled>
                        Select a Year
                    </option>
                    {[1, 2, 3, 4, 5, 7].map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </FormField>
            <FormField label="Course" showError={showError}>
                <select
                    name="course"
                    value={formData.course}
                    onChange={(e) => {
                        handleInputChange(e);
                        setShowResponseError(false);
                    }}
                    className={styles.select}
                    required
                >
                    <option value="" disabled>
                        Select a course
                    </option>
                    {courseOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </FormField>
            <FormField label="Course Units" showError={showError}>
                <Select
                    isMulti
                    options={courseUnitOptions}
                    value={selectedCourseUnitOptions}
                    onChange={handleCourseUnitsChange}
                    isDisabled={!formData.course}
                    styles={{
                        container: (base) => ({ ...base, width: '110%' }),
                        valueContainer: (base) => ({
                            ...base,
                            maxHeight: '175px',
                            overflowY: 'auto'
                        }),
                        menu: (base) => ({ ...base, maxHeight: '125px' }),
                        menuList: (base) => ({ ...base, maxHeight: '125px' })
                    }}
                />
            </FormField>
        </>
    );

    return (
        <div className={styles.formContainer}>
            {mode === 'signUp' && <h2 className={styles.formTitle}>Sign Up</h2>}
            <form onSubmit={handleFormSubmit} className={styles.formGroup}>
                {step === 1 ? renderPersonalInfo() : renderAcademicInfo()}
                {error && showResponseError && (
                    <span className={styles.errorMessage}>{error}</span>
                )}
                <div className={styles.actionButtonGroup}>
                    {step === 1 ? (
                        <>
                            <Button
                                type="button"
                                onClick={() => dispatch(setMode(undefined))}
                                className="back"
                            >
                                Back
                            </Button>
                            <Button
                                type="button"
                                onClick={handleNext}
                                disabled={
                                    formData.firstName === '' ||
                                    formData.lastName === '' ||
                                    formData.email === '' ||
                                    formData.password === '' ||
                                    formData.confirmPassword === ''
                                }
                                style={{ backgroundColor: '#28a745' }}
                                className="logIn"
                            >
                                Next
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                type="button"
                                onClick={() => setStep(1)}
                                className="back"
                            >
                                Previous
                            </Button>
                            <Button
                                type="submit"
                                disabled={!isFormValid}
                                loading={signingUp}
                                className="logIn"
                                onClick={() => {
                                    setShowResponseError(true);
                                }}
                            >
                                {signingUp ? 'Signing Up...' : 'Sign Up'}
                            </Button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
};

export default SignUpForm;
