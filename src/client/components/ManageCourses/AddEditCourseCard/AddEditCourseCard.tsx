import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../Button/Button.js';
import closeIcon from '../../../assets/closeIcon.svg';
import styles from './AddEditCourseCard.module.css';
import { ICourse } from '../../../../common/types/ICourse.js';
// import CourseForm from '../../Forms/CourseForm/CourseForm.js'; // Create this form for handling course-specific inputs
// import {
//     createCourseRequest,
//     updateCourseRequest
// } from '../../../store/slices/courseSlice.js'; // Update actions for courses
import { RootState } from '../../../store/store.js';
import CourseForm from '../../Forms/CourseForm/CourseForm.js';

interface AddEditCourseFormProps {
    onSave: () => void;
    onCancel: () => void;
    course?: ICourse;
}

interface CourseFormData {
    name: string;
    code: string;
    courseUnits: string[]; // IDs of course units
}

const validateForm = (formData: CourseFormData): boolean => {
    const { name, code, courseUnits } = formData;

    return Boolean(name && code && Array.isArray(courseUnits));
};

const AddEditCourseForm: React.FC<AddEditCourseFormProps> = ({
    onSave,
    onCancel,
    course
}) => {
    const [courseUnits, setCourseUnits] = useState([]);
    const [formData, setFormData] = useState<CourseFormData>({
        name: course ? course.name : '',
        code: course ? course.code : '',
        courseUnits: course
            ? course.courseUnits.map((unit) => unit.toString())
            : []
    });

    const { token } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch();

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const target = e.target;
            const { name, value } = target;

            // Handle array inputs for courseUnits
            if (name === 'courseUnits') {
                const courseUnits = value.split(',').map((unit) => unit.trim());
                setFormData((prev) => ({ ...prev, courseUnits }));
            } else {
                setFormData((prev) => ({ ...prev, [name]: value }));
            }
        },
        []
    );

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();

            if (!validateForm(formData)) {
                alert(
                    'All fields are required. Please fill out all the fields.'
                );
                return;
            }

            // course
            //     ? dispatch(
            //           updateCourseRequest({ id: course._id, formData, token })
            //       )
            //     : dispatch(createCourseRequest({ formData, token }));
            // onSave();
        },
        [dispatch, formData, course, onSave, token]
    );

    const handleBackgroundClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) {
                onCancel();
            }
        },
        [onCancel]
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    const formProps = useMemo(
        () => ({
            formData,
            handleInputChange,
            handleSubmit,
            handleBack: onCancel,
            // courseUnits: CourseUnits,
            edit: true
        }),
        [formData, handleInputChange, handleSubmit]
    );

    const CloseButton = memo(() => (
        <Button type="button" onClick={onCancel}>
            <img src={closeIcon} alt="Close" />
        </Button>
    ));

    return (
        <div className={styles.overlay} onClick={handleBackgroundClick}>
            <div
                className={styles.popupCard}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="add-course-title"
            >
                <div className={styles.closeIcon}>
                    <CloseButton />
                </div>
                <h2 id="add/edit-course-title" className={styles.popupTitle}>
                    {course ? `Edit ${course.name}` : 'Add a New Course'}
                </h2>
                <div className={styles.contentContainer}>
                    <CourseForm {...formProps} />
                </div>
            </div>
        </div>
    );
};

export default memo(AddEditCourseForm);
