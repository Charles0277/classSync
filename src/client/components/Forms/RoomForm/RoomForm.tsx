import React from 'react';
import styles from '../Forms.module.css';
import Input from '../../Input/Input';

interface RoomFormProps {
    formData: {
        name: string;
        type: string;
        capacity: number | undefined;
        chairs: number | undefined;
        tables: number | undefined;
    };
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleBack: () => void;
    edit?: boolean;
}

const RoomForm: React.FC<RoomFormProps> = ({
    formData,
    handleInputChange,
    handleSubmit,
    handleBack,
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
            <label htmlFor="type">Type:</label>
            <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className={styles.select}
            >
                <option value="Lecture Theatre">Lecture Theatre</option>
                <option value="Laboratory">Laboratory</option>
                <option value="Office">Office</option>
                <option value="Computer Cluster">Computer Cluster</option>
            </select>
            <div>
                <label htmlFor="capacity">Capacity:</label>
                <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    className="rightSideControl"
                    min={1}
                    max={1000}
                    value={formData.capacity}
                    onChange={handleInputChange}
                    step={1}
                    pattern={`^-?[${1}-${1000}]+$`}
                    title={`Only whole numbers between ${1}-${1000} are allowed`}
                />
            </div>
            <div>
                <label htmlFor="chairs">Chairs:</label>
                <Input
                    id="chairs"
                    name="chairs"
                    type="number"
                    className="rightSideControl"
                    min={1}
                    max={1000}
                    value={formData.chairs}
                    onChange={handleInputChange}
                    step={1}
                    pattern={`^-?[${1}-${1000}]+$`}
                    title={`Only whole numbers between ${1}-${1000} are allowed`}
                />
            </div>
            <div>
                <label htmlFor="tables">Tables:</label>
                <Input
                    id="tables"
                    name="tables"
                    type="number"
                    className="rightSideControl"
                    min={1}
                    max={500}
                    value={formData.tables}
                    onChange={handleInputChange}
                    step={1}
                    pattern={`^-?[${1}-${500}]+$`}
                    title={`Only whole numbers between ${1}-${500} are allowed`}
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

export default RoomForm;
