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

type StudyYear = 1 | 2 | 3 | 4 | 5 | 7;
type FormMode = 'signUp' | 'edit' | 'admin';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    confirmPassword?: string;
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

interface SignUpFormProps {
    formData: FormData;
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    handleSubmit: (e: React.FormEvent) => void;
    mode: FormMode;
    signingUp?: boolean;
    handleBack?: () => void;
}

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

const useCourseData = (selectedCourseId: string) => {
    const dispatch = useDispatch();
    const { courses } = useSelector((state: RootState) => state.course);

    useEffect(() => {
        if (!courses.length) {
            dispatch(fetchAllCoursesRequest());
        }
    }, [dispatch, courses.length]);

    return useMemo(() => {
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
};

const SignUpForm: React.FC<SignUpFormProps> = ({
    formData,
    handleInputChange,
    handleSubmit,
    mode,
    signingUp,
    handleBack
}) => {
    const { error } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const [step, setStep] = useState(1);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [showError, setShowError] = useState(false);
    const [showResponseError, setShowResponseError] = useState(false);
    const { selectedCourseUnits, courseOptions } = useCourseData(
        formData.course
    );

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

    const validateFields = useCallback(() => {
        const errors: FormErrors = {};
        const { firstName, lastName, email, password, confirmPassword } =
            formData;

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

        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!MANCHESTER_EMAIL_REGEX.test(email)) {
            errors.email =
                'Must be a valid University of Manchester email address';
        }

        if (mode === 'signUp') {
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

    const isPersonalInfoFormFilled =
        formData.firstName.trim() !== '' &&
        formData.lastName.trim() !== '' &&
        formData.email.trim() !== '' &&
        (mode === 'signUp'
            ? formData.password !== '' && formData.confirmPassword !== ''
            : true);

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
            <FormField label="Year of Study" showError={showError}>
                <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy || ''}
                    onChange={(e) => {
                        handleInputChange(e);
                        setShowResponseError(false);
                        formData.courseUnits = [];
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
                        formData.courseUnits = [];
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
            {mode === 'signUp' && !handleBack && (
                <h2 className={styles.formTitle}>Sign Up</h2>
            )}
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
                                onClick={() => {
                                    mode === 'signUp'
                                        ? dispatch(setMode(undefined))
                                        : handleBack?.();
                                }}
                                className="back"
                            >
                                Back
                            </Button>
                            <Button
                                type="button"
                                onClick={handleNext}
                                disabled={!isPersonalInfoFormFilled}
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
                                disabled={Object.keys(formErrors).length > 0}
                                loading={signingUp}
                                className="logIn"
                                onClick={() => {
                                    setShowResponseError(true);
                                }}
                            >
                                {mode !== 'signUp' ? 'Save' : 'Submit'}
                            </Button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
};

export default SignUpForm;
