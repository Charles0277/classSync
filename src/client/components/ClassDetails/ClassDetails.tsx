import {
    getClassRequest,
    resetClassEntity,
    updateClassRequest
} from '@/client/store/slices/classSlice';
import { RootState } from '@/client/store/store';
import { IIndividualScheduleEntry } from '@/common/types/ISchedule';
import { convertRoomTypeToClassType, getIdString } from '@/common/utils';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button/Button';
import styles from './ClassDetails.module.css';

interface ClassDetailsProps {
    entry: IIndividualScheduleEntry;
}

export const ClassDetails: React.FC<ClassDetailsProps> = ({ entry }) => {
    const dispatch = useDispatch();
    const { classEntity } = useSelector((state: RootState) => state.class);
    const { token, user } = useSelector((state: RootState) => state.auth);

    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(
        classEntity?.description || 'No description provided.'
    );

    useEffect(() => {
        if (token && getIdString(classEntity?._id) !== entry.classId) {
            dispatch(getClassRequest({ token, id: entry.classId }));
        }
    }, [dispatch, token, entry.classId, classEntity?._id]);

    useEffect(() => {
        setDescription(classEntity?.description || 'No description provided.');
    }, [classEntity?.description]);

    useEffect(() => {
        return () => {
            dispatch(resetClassEntity());
        };
    }, [dispatch]);

    const handleEdit = () => setIsEditing(true);

    const handleSave = () => {
        if (classEntity?._id) {
            dispatch(
                updateClassRequest({
                    token,
                    id: classEntity._id,
                    formData: { description }
                })
            );
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setDescription(classEntity?.description || 'No description provided.');
        setIsEditing(false);
    };

    return (
        <div className={styles.classDetails}>
            <div className={styles.classProperty}>
                <span className={styles.title}>Title:</span> {entry.className}
            </div>
            <div className={styles.classProperty}>
                <span className={styles.title}>Room:</span> {entry.roomName}
            </div>
            <div className={styles.classProperty}>
                <span className={styles.title}>Class Type:</span>{' '}
                {convertRoomTypeToClassType(entry.classType)}
            </div>
            <div className={styles.classProperty}>
                <span className={styles.title}>Time:</span>{' '}
                {`${entry.hour}:00 - ${entry.hour + 1}:00`}
            </div>
            <div className={styles.classProperty}>
                <span className={styles.title}>Teacher:</span>{' '}
                {entry.instructorName}
            </div>
            <div className={styles.classProperty}>
                <div className={styles.descriptionActions}>
                    <span className={styles.title}>Description:</span>
                    {user?.role !== 'student' && !isEditing && (
                        <Button
                            type="button"
                            className="classDetails"
                            onClick={handleEdit}
                        >
                            Edit
                        </Button>
                    )}
                </div>
                {isEditing ? (
                    <div className={styles.descriptionEdit}>
                        <textarea
                            className={styles.descriptionInput}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className={styles.descriptionEditButtons}>
                            <Button
                                type="button"
                                className="classDetailsCancel"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                className="classDetailsSave"
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.description}>{description}</div>
                )}
            </div>
        </div>
    );
};
