import React, { useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import { RangeDatePicker } from '../../ui/RangeDatePicker';
import styles from '../Forms.module.css';
import { RootState } from '@/client/store/store';
import { useSelector } from 'react-redux';

interface HolidayFormProps {
    formData: {
        name: string;
        startDate?: string;
        endDate?: string;
    };
    handleInputChange: (
        e:
            | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
            | { target: { name: string; value: string | Date } }
    ) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleBack: () => void;
    edit?: boolean;
}

export const HolidayForm: React.FC<HolidayFormProps> = ({
    formData,
    handleInputChange,
    handleSubmit,
    handleBack,
    edit
}) => {
    const { error } = useSelector((state: RootState) => state.holiday);

    const [showResponseError, setShowResponseError] = useState(false);
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: formData.startDate ? new Date(formData.startDate) : undefined,
        to: formData.endDate ? new Date(formData.endDate) : undefined
    });
    const [hiddenDates, setHiddenDates] = React.useState<DateRange>({
        from: new Date(),
        to: new Date()
    });

    const { currentAcademicYear, hasAcademicYearStarted } = useMemo(() => {
        const now = new Date();
        const year = now.getFullYear();
        return {
            currentAcademicYear: year,
            hasAcademicYearStarted: now.getMonth() >= 8
        };
    }, []);

    useEffect(() => {
        setHiddenDates({
            from: new Date(
                !hasAcademicYearStarted
                    ? currentAcademicYear - 1
                    : currentAcademicYear,
                8,
                1
            ),
            to: new Date(
                !hasAcademicYearStarted
                    ? currentAcademicYear
                    : currentAcademicYear + 1,
                5,
                30
            )
        });
    }, [currentAcademicYear, hasAcademicYearStarted]);

    useEffect(() => {
        if (date?.from && date?.to) {
            handleInputChange({
                target: {
                    name: 'startDate',
                    value: date.from.toISOString()
                }
            });

            handleInputChange({
                target: {
                    name: 'endDate',
                    value: date.to.toISOString()
                }
            });
        }
    }, [date]);

    const isFormFilled =
        formData.name.trim() !== '' &&
        formData.startDate !== undefined &&
        formData.endDate !== undefined;

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
                <label htmlFor="date">Start/End Date:</label>
                <RangeDatePicker
                    date={date!}
                    setDate={setDate}
                    hiddenDates={hiddenDates}
                    className={styles.datePicker}
                    id="date"
                />
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
