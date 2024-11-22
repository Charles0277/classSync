import React, { useEffect, useState } from 'react';
import styles from '../Forms.module.css';
import Input from '../../Input/Input';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourseUnitsRequest } from '../../../store/slices/courseUnitSlice';
import { RootState } from '../../../store/store';

interface RoomFormProps {
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

const CourseForm: React.FC<RoomFormProps> = ({
    formData,
    handleInputChange,
    handleSubmit,
    handleBack,
    edit
}) => {
    const { courseUnits } = useSelector((state: RootState) => state.courseUnit);
    const { courses } = useSelector((state: RootState) => state.course);

    const [selectedCourseUnits, setSelectedCourseUnits] = useState<
        { value: string; label: string }[]
    >(
        formData.courseUnits
            ?.map((id) => courseUnits?.find((unit) => unit._id === id))
            .filter(
                (unit): unit is NonNullable<typeof unit> =>
                    unit !== undefined && unit !== null
            )
            .map((unit) => ({ value: unit._id as string, label: unit.name })) ||
            []
    );

    useEffect(() => {
        if (selectedCourseUnits.length === 0) {
            const mappedUnits =
                formData.courseUnits
                    ?.map((id) => courseUnits.find((unit) => unit._id === id))
                    .filter(
                        (unit): unit is NonNullable<typeof unit> =>
                            unit !== undefined && unit !== null
                    )
                    .map((unit) => ({
                        value: unit._id as string,
                        label: unit.name
                    })) || [];
            setSelectedCourseUnits(mappedUnits);
        }
    }, [courseUnits, formData.courseUnits]);

    const dispatch = useDispatch();

    useEffect(() => {
        if (courseUnits.length === 0) {
            dispatch(fetchAllCourseUnitsRequest());
        }
    }, []);

    const handleSelectedChange = (selected: any) => {
        // Map selected options to an array of IDs (value)
        const courseUnits = selected
            ? selected.map((option: any) => option.value)
            : [];

        // Update the selectedCourseUnits state
        setSelectedCourseUnits(selected);

        // Update the parent formData via handleInputChange
        handleInputChange({ name: 'courseUnits', value: courseUnits });
    };

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
                <div>
                    <label htmlFor="courseUnits">Course Units:</label>
                    {formData.courseUnits.length ===
                        selectedCourseUnits.length && (
                        <Select
                            options={courseUnits.map((unit) => ({
                                value: unit._id as string,
                                label: unit.name
                            }))}
                            isClearable
                            isMulti
                            defaultValue={selectedCourseUnits}
                            onChange={(selected) => {
                                handleSelectedChange(selected);
                            }}
                            placeholder="Select Course Units"
                            styles={{
                                container(base, props) {
                                    return {
                                        ...base,
                                        width: '110%'
                                    };
                                }
                            }}
                            maxMenuHeight={200}
                        />
                    )}
                </div>
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
