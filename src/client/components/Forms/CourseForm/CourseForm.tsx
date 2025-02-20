import { getIdString } from '@/common/utils';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { fetchAllCourseUnitsRequest } from '../../../store/slices/courseUnitSlice';
import { RootState } from '../../../store/store';
import Input from '../../Input/Input';
import styles from '../Forms.module.css';

interface CourseFormProps {
    formData: {
        name: string;
        code: string;
        courseUnits: string[];
    };
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | any
    ) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleBack: () => void;
    edit?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({
    formData,
    handleInputChange,
    handleSubmit,
    handleBack,
    edit
}) => {
    const dispatch = useDispatch();
    const { courseUnits } = useSelector((state: RootState) => state.courseUnit);

    const [selectedCourseUnits, setSelectedCourseUnits] = useState<
        { value: string; label: string }[]
    >(() =>
        formData.courseUnits
            .map((id) =>
                courseUnits.find((unit) => getIdString(unit._id) === id)
            )
            .filter(Boolean)
            .map((unit) => ({
                value: getIdString(unit!._id),
                label: unit!.name
            }))
    );

    useEffect(() => {
        if (selectedCourseUnits.length === 0) {
            const mappedUnits =
                formData.courseUnits
                    .map((id) =>
                        courseUnits.find((unit) => getIdString(unit._id) === id)
                    )
                    .filter(Boolean)
                    .map((unit) => ({
                        value: getIdString(unit!._id),
                        label: unit!.name
                    })) || [];
            setSelectedCourseUnits(mappedUnits);
        }
    }, [courseUnits, formData.courseUnits]);

    useEffect(() => {
        if (!courseUnits.length) {
            dispatch(fetchAllCourseUnitsRequest());
        }
    }, [dispatch, courseUnits.length]);

    const handleSelectedChange = (selected: any) => {
        const updatedUnits = selected
            ? selected.map((option: any) => option.value)
            : [];
        setSelectedCourseUnits(selected);
        handleInputChange({ name: 'courseUnits', value: updatedUnits });
    };

    const courseUnitOptions = courseUnits.map((unit) => ({
        value: getIdString(unit._id),
        label: unit.name
    }));

    return (
        <div className={`${styles.formContainer} ${styles.notSignUp}`}>
            <form className={styles.formGroup} onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                />

                <label htmlFor="code">Code:</label>
                <Input
                    type="text"
                    id="code"
                    name="code"
                    placeholder="Code"
                    value={formData.code}
                    onChange={handleInputChange}
                />

                <label htmlFor="courseUnits">Course Units:</label>
                <Select
                    options={courseUnitOptions}
                    isClearable
                    isMulti
                    value={selectedCourseUnits}
                    onChange={handleSelectedChange}
                    placeholder="Select Course Units"
                    styles={{
                        container: (base) => ({
                            ...base,
                            width: '110%'
                        })
                    }}
                    maxMenuHeight={200}
                />

                <div className={styles.actionButtonGroup}>
                    <Input
                        type="button"
                        id="back"
                        name="back"
                        value="Back"
                        onClick={handleBack}
                    />
                    <Input
                        type="submit"
                        id="submit"
                        name="submit"
                        value={edit ? 'Save' : 'Submit'}
                    />
                </div>
            </form>
        </div>
    );
};

export default CourseForm;
