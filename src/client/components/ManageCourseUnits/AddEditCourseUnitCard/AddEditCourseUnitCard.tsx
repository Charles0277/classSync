import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ICourseUnit } from '../../../../common/types/ICourseUnit.js';
import closeIcon from '../../../assets/closeIcon.svg';
import {
    createCourseUnitRequest,
    updateCourseUnitRequest
} from '../../../store/slices/courseUnitSlice.js';
import { RootState } from '../../../store/store.js';
import Button from '../../Button/Button.js';
import CourseUnitForm from '../../Forms/CourseUnitForm/CourseUnitForm.js';
import styles from './AddEditCourseUnitCard.module.css';

interface AddEditCourseUnitFormProps {
    onSave: () => void;
    onCancel: () => void;
    courseUnit?: ICourseUnit;
}

interface CourseUnitFormData {
    name: string;
    code: string;
    instructor: string;
    classTypes: string[];
}

const validateForm = (formData: CourseUnitFormData): boolean => {
    const { name, code, instructor } = formData;

    return Boolean(name && code && instructor);
};

const AddEditCourseUnitForm: React.FC<AddEditCourseUnitFormProps> = ({
    onSave,
    onCancel,
    courseUnit
}) => {
    const [formData, setFormData] = useState<CourseUnitFormData>({
        name: courseUnit ? courseUnit.name : '',
        code: courseUnit ? courseUnit.code : '',
        instructor: courseUnit ? courseUnit.instructor._id.toString() : '',
        classTypes: courseUnit ? courseUnit.classTypes : []
    });

    const { token } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch();

    const handleInputChange = useCallback(
        (
            e:
                | React.ChangeEvent<HTMLInputElement>
                | { name: string; value: any }
        ) => {
            const { name, value } = 'target' in e ? e.target : e;

            if (name === 'instructor') {
                setFormData((prev) => ({ ...prev, [name]: value }));
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

            courseUnit
                ? dispatch(
                      updateCourseUnitRequest({
                          id: courseUnit._id,
                          formData,
                          token
                      })
                  )
                : dispatch(createCourseUnitRequest({ formData, token }));
            onSave();
        },
        [dispatch, formData, courseUnit, onSave, token]
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
            edit: !!courseUnit
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
                aria-labelledby="add-course-unit-title"
            >
                <div className={styles.closeIcon}>
                    <CloseButton />
                </div>
                <h2
                    id="add/edit-couse-unit-title"
                    className={styles.popupTitle}
                >
                    {courseUnit
                        ? `Edit ${courseUnit.name}`
                        : 'Add a New Course Unit'}
                </h2>
                <div className={styles.contentContainer}>
                    <CourseUnitForm {...formProps} />
                </div>
            </div>
        </div>
    );
};

export default memo(AddEditCourseUnitForm);
