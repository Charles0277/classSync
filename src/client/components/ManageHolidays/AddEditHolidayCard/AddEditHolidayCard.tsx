import {
    createHolidayRequest,
    updateHolidayRequest
} from '@/client/store/slices/holidaySlice.ts';
import { IHoliday } from '@/common/types/IHoliday.ts';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import closeIcon from '../../../assets/closeIcon.svg';
import { RootState } from '../../../store/store.ts';
import Button from '../../Button/Button.tsx';
import { HolidayForm } from '../../Forms/HolidayForm/HolidayForm.tsx';
import styles from './AddEditHolidayCard.module.css';

interface AddEditHolidayFormProps {
    onSave: () => void;
    onCancel: () => void;
    holiday?: IHoliday;
}

interface HolidayFormData {
    name: string;
    startDate?: string;
    endDate?: string;
}

const validateForm = (formData: HolidayFormData): boolean => {
    const { name, startDate, endDate } = formData;

    return Boolean(name && startDate && endDate);
};

const AddEditHolidayForm: React.FC<AddEditHolidayFormProps> = ({
    onSave,
    onCancel,
    holiday
}) => {
    const { token } = useSelector((state: RootState) => state.auth);
    const { loading, error } = useSelector((state: RootState) => state.holiday);

    const dispatch = useDispatch();

    const [formData, setFormData] = useState<HolidayFormData>({
        name: holiday ? holiday.name : '',
        startDate: holiday ? holiday.startDate : undefined,
        endDate: holiday ? holiday.endDate : undefined
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isSubmitting && !loading && !error) {
            onSave();
        }
    }, [loading, error, onSave, isSubmitting]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    const handleInputChange = useCallback(
        (
            e:
                | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
                | { target: { name: string; value: string | Date } }
        ) => {
            const target = e.target;
            const { name, value } = target;
            setFormData((prev) => ({ ...prev, [name]: value }));
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

            setIsSubmitting(true);
            holiday
                ? dispatch(
                      updateHolidayRequest({ id: holiday._id, formData, token })
                  )
                : dispatch(createHolidayRequest({ formData, token }));
        },
        [dispatch, formData, token]
    );

    const handleBackgroundClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) {
                onCancel();
            }
        },
        [onCancel]
    );

    const formProps = useMemo(
        () => ({
            formData,
            handleInputChange,
            handleSubmit,
            handleBack: onCancel,
            edit: !!holiday
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
                aria-labelledby="add-holiday-title"
            >
                <div className={styles.closeIcon}>
                    <CloseButton />
                </div>
                <h2 id="add/edit-holiday-title" className={styles.popupTitle}>
                    {holiday ? `Edit ${holiday.name}` : 'Add a New Holiday'}
                </h2>
                <div className={styles.contentContainer}>
                    <HolidayForm {...formProps} />
                </div>
            </div>
        </div>
    );
};

export default memo(AddEditHolidayForm);
