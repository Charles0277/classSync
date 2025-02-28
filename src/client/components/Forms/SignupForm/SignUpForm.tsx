import { MANCHESTER_EMAIL_REGEX } from '@/common/validation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { ICourseUnit } from '../../../../common/types/ICourseUnit';
import { findFirstDigit, getIdString } from '../../../../common/utils';
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
    setMode?: React.Dispatch<
        React.SetStateAction<'logIn' | 'signUp' | undefined>
    >;
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

const FormField: React.FC<{
    label: string;
    children: React.ReactNode;
    error?: string;
}> = ({ label, children, error }) => (
    <div className={styles.formField}>
        <label>{label}:</label>
        {children}
        {error && <span className={styles.errorMessage}>{error}</span>}
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
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [showErrors, setShowErrors] = useState(false);
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

    const courseUnitOptions = useMemo(
        () =>
            filteredCourseUnits.map((courseUnit) => ({
                value: getIdString(courseUnit._id),
                label: (courseUnit as ICourseUnit).name
            })),
        [filteredCourseUnits]
    );

    const selectedCourseUnitOptions = useMemo(
        () =>
            courseUnitOptions.filter((option) =>
                formData.courseUnits.includes(option.value)
            ),
        [courseUnitOptions, formData.courseUnits]
    );

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = validateFields();
        setShowErrors(true);

        if (isValid) {
            setStep(step + 1);
            setShowErrors(false);
        }
    };

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLFormElement>) => {
            if (e.key === 'Enter' && step === 1) {
                e.preventDefault();
                handleNext(e as unknown as React.FormEvent);
            }
        },
        [handleNext, step]
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

    const validateFields = () => {
        const errors: FormErrors = {};

        // First Name validation
        if (!formData.firstName?.trim()) {
            errors.firstName = 'This field is required';
        } else if (!/^[a-zA-Z]+$/.test(formData.firstName)) {
            errors.firstName = 'Only letters are allowed';
        } else if (
            formData.firstName.length < 2 ||
            formData.firstName.length > 50
        ) {
            errors.firstName = 'Length must be between 2 and 50 characters';
        }

        // Last Name validation
        if (!formData.lastName?.trim()) {
            errors.lastName = 'This field is required';
        } else if (!/^[a-zA-Z]+$/.test(formData.lastName)) {
            errors.lastName = 'Only letters are allowed';
        } else if (
            formData.lastName.length < 2 ||
            formData.lastName.length > 50
        ) {
            errors.lastName = 'Length must be between 2 and 50 characters';
        }

        // Email validation
        if (!formData.email?.trim()) {
            errors.email = 'Email is required';
        } else if (!MANCHESTER_EMAIL_REGEX.test(formData.email)) {
            errors.email =
                'Must be a valid University of Manchester email address';
        }

        // Password validation (only for signup/edit mode)
        if (mode === 'signUp' || mode === 'edit') {
            if (!formData.password) {
                errors.password = 'Password is required';
            } else if (
                !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}/.test(
                    formData.password
                )
            ) {
                errors.password =
                    'Password must contain at least 8 characters, including uppercase, number, and special character';
            }

            if (!formData.confirmPassword) {
                errors.confirmPassword = 'Please confirm your password';
            } else if (formData.confirmPassword !== formData.password) {
                errors.confirmPassword = 'Passwords do not match';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = validateFields();
        setShowErrors(true);

        if (isValid) {
            handleSubmit(e);
        }
    };

    const renderPersonalInfoFields = () => (
        <>
            <FormField label="First name" error={formErrors.firstName}>
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
                />
            </FormField>
            <FormField label="Last name" error={formErrors.lastName}>
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
                />
            </FormField>
            <FormField label="Email" error={formErrors.email}>
                <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
            </FormField>
            {(mode === 'signUp' || mode === 'edit') && (
                <>
                    <FormField label="Password" error={formErrors.password}>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </FormField>
                    <FormField
                        label="Confirm password"
                        error={formErrors.confirmPassword}
                    >
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
                <Select
                    isMulti
                    options={courseUnitOptions}
                    value={selectedCourseUnitOptions}
                    onChange={(selected) => {
                        const selectedValues = selected
                            ? selected.map((option) => option.value)
                            : [];
                        handleInputChange({
                            target: {
                                name: 'courseUnits',
                                value: selectedValues
                            }
                        } as unknown as React.ChangeEvent<HTMLSelectElement>);
                    }}
                    isDisabled={!formData.course}
                    placeholder="Select Course Units"
                    styles={{
                        container: (base) => ({
                            ...base,
                            width: '110%'
                        }),
                        valueContainer: (base) => ({
                            ...base,
                            maxHeight: '175px',
                            overflowY: 'auto'
                        }),
                        menu: (base) => ({
                            ...base,
                            maxHeight: '125px',
                            overflowY: 'auto'
                        }),
                        menuList: (base) => ({
                            ...base,
                            maxHeight: '125px',
                            overflowY: 'auto'
                        })
                    }}
                />
            </FormField>
        </>
    );

    return (
        <div className={`${styles.formContainer}`}>
            {mode === 'signUp' && setMode && (
                <h2 className={styles.formTitle}>Sign Up</h2>
            )}
            <form
                className={styles.formGroup}
                onSubmit={handleFormSubmit}
                onKeyDown={handleKeyDown}
            >
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
