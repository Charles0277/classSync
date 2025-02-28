import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRoom } from '../../../../common/types/IRoom.js';
import closeIcon from '../../../assets/closeIcon.svg';
import {
    createRoomRequest,
    updateRoomRequest
} from '../../../store/slices/roomSlice.js';
import { RootState } from '../../../store/store.js';
import Button from '../../Button/Button.js';
import RoomForm from '../../Forms/RoomForm/RoomForm.js';
import styles from './AddEditRoomCard.module.css';

interface AddEditRoomFormProps {
    onSave: () => void;
    onCancel: () => void;
    room?: IRoom;
}

interface RoomFormData {
    name: string;
    type: string;
    capacity: number | undefined;
    chairs: number | undefined;
    tables: number | undefined;
}

const validateForm = (formData: RoomFormData): boolean => {
    const { name, type, capacity, chairs, tables } = formData;

    return Boolean(name && type && capacity && chairs && tables);
};

const AddEditRoomForm: React.FC<AddEditRoomFormProps> = ({
    onSave,
    onCancel,
    room
}) => {
    const { token } = useSelector((state: RootState) => state.auth);
    const { loading, error } = useSelector((state: RootState) => state.room);

    const dispatch = useDispatch();

    const [formData, setFormData] = useState<RoomFormData>({
        name: room ? room.name : '',
        type: room ? room.type : '',
        capacity: room ? room.capacity : undefined,
        chairs: room ? room.chairs : undefined,
        tables: room ? room.tables : undefined
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
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            room
                ? dispatch(updateRoomRequest({ id: room._id, formData, token }))
                : dispatch(createRoomRequest({ formData, token }));
        },
        [dispatch, formData, room, token]
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
            edit: !!room
        }),
        [formData, handleInputChange, handleSubmit]
    );

    return (
        <div className={styles.overlay} onClick={handleBackgroundClick}>
            <div
                className={styles.popupCard}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="add-room-title"
            >
                <div className={styles.closeIcon}>
                    <Button type="button" onClick={onCancel}>
                        <img src={closeIcon} alt="Close" />
                    </Button>
                </div>
                <h2 id="add/edit-room-title" className={styles.popupTitle}>
                    {room ? `Edit ${room.name}` : 'Add a New Room'}
                </h2>
                <div className={styles.contentContainer}>
                    <RoomForm {...formProps} />
                </div>
            </div>
        </div>
    );
};

export default memo(AddEditRoomForm);
