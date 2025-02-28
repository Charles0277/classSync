import { RootState } from '@/client/store/store';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import styles from '../Forms.module.css';

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
}) => {
    const [showResponseError, setShowResponseError] = useState(false);
    const { error } = useSelector((state: RootState) => state.room);

    const isFormFilled =
        formData.name.trim() !== '' &&
        formData.type.trim() !== '' &&
        formData.capacity !== undefined &&
        formData.chairs !== undefined &&
        formData.tables !== undefined;

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
                <label htmlFor="type">Type:</label>
                <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className={styles.select}
                >
                    <option value="" disabled>
                        Select a Room Type
                    </option>
                    <option value="lectureTheatre">Lecture Theatre</option>
                    <option value="classroom">Classroom</option>
                    <option value="office">Office</option>
                    <option value="computerCluster">Computer Cluster</option>
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
                {error && showResponseError && (
                    <span className={styles.errorMessage}>{error}</span>
                )}
                <div className={styles.actionButtonGroup}>
                    <Button type="button" onClick={handleBack} className="back">
                        Back
                    </Button>
                    <Button
                        type="submit"
                        className="logIn"
                        disabled={!isFormFilled}
                        onClick={() => {
                            setShowResponseError(true);
                        }}
                    >
                        {edit ? 'Save' : 'Submit'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
export default RoomForm;
