import React from 'react';
import styles from '../Forms.module.css';
import Input from '../../Input/Input';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { ICourseUnit } from '../../../../common/types/ICourseUnit';

interface RoomFormProps {
    formData: {
        name: string;
        code: string;
        courseUnits: string[];
    };
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleBack: () => void;
    // courseUnits: ICourseUnit[];
    edit?: boolean;
}

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
];

const CourseForm: React.FC<RoomFormProps> = ({
    formData,
    handleInputChange,
    handleSubmit,
    handleBack,
    // courseUnits,
    edit
}) => (
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
                placeholder="code"
                value={formData.code}
                onChange={handleInputChange}
            />
            <div>
                <label htmlFor="courseUnits">Course Units:</label>
                <Select
                    options={options}
                    isClearable
                    isMulti
                    // value={formData.courseUnits}
                />
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

export default CourseForm;
