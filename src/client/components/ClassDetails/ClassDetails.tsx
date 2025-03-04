import {
    deleteClassRequest,
    getClassRequest,
    resetClassEntity,
    updateClassRequest
} from '@/client/store/slices/classSlice';
import {
    deleteGlobalScheduleEntryRequest,
    updateGlobalScheduleEntryRequest
} from '@/client/store/slices/scheduleSlice';
import {
    fetchAllTeachersRequest,
    fetchUsersRequest
} from '@/client/store/slices/userSlice';
import { RootState } from '@/client/store/store';
import {
    IGlobalScheduleEntry,
    IUserScheduleEntry
} from '@/common/types/ISchedule';
import { convertRoomTypeToClassType, getIdString } from '@/common/utils';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import Button from '../Button/Button';
import styles from './ClassDetails.module.css';

interface ClassDetailsProps {
    entry: IUserScheduleEntry | IGlobalScheduleEntry;
}

export const ClassDetails: React.FC<ClassDetailsProps> = ({ entry }) => {
    const { classEntity } = useSelector((state: RootState) => state.class);
    const { token, user } = useSelector((state: RootState) => state.auth);
    const { users, students } = useSelector((state: RootState) => state.user);
    const { rooms } = useSelector((state: RootState) => state.room);
    const { teachers } = useSelector((state: RootState) => state.user);

    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editedFields, setEditedFields] = useState({
        className: entry.className,
        roomId: (entry as IGlobalScheduleEntry).roomId,
        classType: entry.classType,
        hour: entry.hour,
        instructorId: (entry as IGlobalScheduleEntry).instructorId,
        description: classEntity?.description || 'No description provided.',
        studentIds: (entry as IGlobalScheduleEntry).studentIds
    });

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        if (token && getIdString(classEntity?._id) !== entry.classId) {
            dispatch(getClassRequest({ token, id: entry.classId }));
        }
    }, [
        dispatch,
        token,
        entry.classId,
        classEntity?._id,
        classEntity?.students
    ]);

    useEffect(() => {
        if (classEntity?.students?.length) {
            dispatch(
                fetchUsersRequest({
                    token,
                    studentsIds: classEntity?.students
                })
            );
        }
    }, [dispatch, token, JSON.stringify(classEntity?.students)]);

    useEffect(() => {
        setEditedFields((fields) => ({
            ...fields,
            description: classEntity?.description || 'No description provided.'
        }));
    }, [classEntity?.description]);

    useEffect(() => {
        return () => {
            dispatch(resetClassEntity());
        };
    }, [dispatch]);

    useEffect(() => {
        if (teachers.length === 0 && isAdmin) {
            dispatch(fetchAllTeachersRequest({ token }));
        }
    }, [dispatch, token, teachers, isAdmin]);

    const teacherOptions = teachers
        ? teachers.map((teacher) => ({
              value: getIdString(teacher._id),
              label: `${teacher.firstName} ${teacher.lastName}`
          }))
        : [];

    const studentOptions = students
        ? students.map((student) => ({
              value: getIdString(student._id),
              label: `${student.firstName} ${student.lastName}`
          }))
        : [];

    const roomOptions = rooms
        ? rooms.map((room) => ({
              value: getIdString(room._id),
              label: room.name
          }))
        : [];

    const classTypesOptions = [
        { value: ['lectureTheatre'], label: 'Lecture' },
        { value: ['laboratory'], label: 'Laboratory' },
        { value: ['workshop'], label: 'Workshop' },
        { value: ['seminar'], label: 'Seminar' },
        { value: ['office'], label: 'Meeting' }
    ];

    const timeOptions = Array.from({ length: 10 }, (_, index) => {
        const hour = index + 9;
        const startTime = hour.toString().padStart(2, '0');
        const endTime = (hour + 1).toString().padStart(2, '0');
        return {
            value: hour,
            label: `${startTime}:00 - ${endTime}:00`
        };
    });

    const handleEdit = () => setIsEditing(true);

    const handleDelete = () => {
        if (!classEntity?._id) return;
        dispatch(deleteClassRequest({ token, id: entry.classId }));
        dispatch(
            deleteGlobalScheduleEntryRequest({ token, id: entry.classId })
        );
        setShowDeleteConfirm(false);
    };

    const handleSave = () => {
        if (!classEntity?._id) return;
        const changedClassFields: Record<string, any> = {};
        const changedScheduleFields: Record<string, any> = {};

        if (isAdmin) {
            if (editedFields.className !== entry.className) {
                changedClassFields.name = editedFields.className;
            }
            if (
                editedFields.instructorId !==
                (entry as IGlobalScheduleEntry).instructorId
            ) {
                changedClassFields.instructor = editedFields.instructorId;
                changedScheduleFields.instructorId = editedFields.instructorId;
            }
            if (editedFields.classType !== entry.classType) {
                changedClassFields.classTypes = editedFields.classType;
            }
            if (
                editedFields.roomId !== (entry as IGlobalScheduleEntry).roomId
            ) {
                changedScheduleFields.roomId = editedFields.roomId;
            }
            if (editedFields.hour !== entry.hour) {
                changedScheduleFields.hour = editedFields.hour;
            }

            const sortedEditedStudentIds = [...editedFields.studentIds]
                .sort()
                .toString();
            const sortedEntryStudentIds = [
                ...(entry as IGlobalScheduleEntry).studentIds
            ]
                .sort()
                .toString();
            if (sortedEditedStudentIds !== sortedEntryStudentIds) {
                changedScheduleFields.studentIds = editedFields.studentIds;
                changedClassFields.students = editedFields.studentIds;
            }
        }

        if (editedFields.description !== classEntity.description) {
            changedClassFields.description = editedFields.description;
        }

        if (Object.keys(changedScheduleFields).length > 0) {
            dispatch(
                updateGlobalScheduleEntryRequest({
                    token,
                    id: entry.classId,
                    formData: changedScheduleFields
                })
            );
        }
        if (Object.keys(changedClassFields).length > 0) {
            dispatch(
                updateClassRequest({
                    token,
                    id: classEntity._id,
                    formData: changedClassFields
                })
            );
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedFields({
            className: entry.className,
            roomId: entry.roomName,
            classType: entry.classType,
            hour: entry.hour,
            instructorId: entry.instructorName,
            description: classEntity?.description || 'No description provided.',
            studentIds: (entry as IGlobalScheduleEntry).studentIds
        });
        setIsEditing(false);
    };

    return (
        <div className={styles.classDetails}>
            {isAdmin && !isEditing && (
                <div className={styles.actionButtons}>
                    {!showDeleteConfirm && (
                        <Button
                            type="button"
                            className="classDetails"
                            onClick={handleEdit}
                        >
                            Edit
                        </Button>
                    )}
                    {showDeleteConfirm ? (
                        <div className={styles.confirmDeleteContainer}>
                            <span>Confirm delete?</span>
                            <div className={styles.confirmDeleteButtonGroup}>
                                <Button
                                    type="button"
                                    className="classDetails"
                                    onClick={handleDelete}
                                >
                                    Yes
                                </Button>
                                <Button
                                    type="button"
                                    className="classDetails"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    No
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            className="classDetails"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            Delete
                        </Button>
                    )}
                </div>
            )}
            <div className={styles.classProperty}>
                <span className={styles.title}>Title:</span>
                {isEditing && isAdmin ? (
                    <input
                        className={styles.descriptionInput}
                        type="text"
                        value={editedFields.className}
                        onChange={(e) =>
                            setEditedFields({
                                ...editedFields,
                                className: e.target.value
                            })
                        }
                    />
                ) : (
                    <span>{entry.className}</span>
                )}
            </div>
            <div className={styles.classProperty}>
                <span className={styles.title}>Room:</span>
                {isEditing && isAdmin ? (
                    <Select
                        options={roomOptions}
                        defaultValue={{
                            value: (entry as IGlobalScheduleEntry).roomId,
                            label: entry.roomName
                        }}
                        onChange={(selectedRoom) => {
                            if (selectedRoom) {
                                setEditedFields({
                                    ...editedFields,
                                    roomId: selectedRoom.value
                                });
                            }
                        }}
                        placeholder="Select Room"
                        styles={{
                            container: (base) => ({
                                ...base,
                                minWidth: '17rem',
                                padding: '0.5rem',
                                marginRight: '-0.5rem',
                                marginLeft: '-0.5rem'
                            })
                        }}
                    />
                ) : (
                    <span>{entry.roomName}</span>
                )}
            </div>
            <div className={styles.classProperty}>
                <span className={styles.title}>Class Type:</span>{' '}
                {isEditing && isAdmin ? (
                    <Select
                        options={classTypesOptions}
                        defaultValue={{
                            value: entry.classType,
                            label: convertRoomTypeToClassType(entry.classType)
                        }}
                        onChange={(selectedClassType) => {
                            if (selectedClassType) {
                                setEditedFields({
                                    ...editedFields,
                                    classType: selectedClassType.value
                                });
                            }
                        }}
                        placeholder="Select Class Type"
                        styles={{
                            container: (base) => ({
                                ...base,
                                minWidth: '17rem',
                                padding: '0.5rem',
                                marginRight: '-0.5rem',
                                marginLeft: '-0.5rem'
                            })
                        }}
                    />
                ) : (
                    <span>{convertRoomTypeToClassType(entry.classType)}</span>
                )}
            </div>
            <div className={styles.classProperty}>
                <span className={styles.title}>Time:</span>{' '}
                {isEditing && isAdmin ? (
                    <Select
                        options={timeOptions}
                        defaultValue={{
                            value: entry.hour,
                            label: `${entry.hour}:00 - ${entry.hour + 1}:00`
                        }}
                        onChange={(selectedTime) => {
                            if (selectedTime) {
                                setEditedFields({
                                    ...editedFields,
                                    hour: selectedTime.value
                                });
                            }
                        }}
                        placeholder="Select Time"
                        styles={{
                            container: (base) => ({
                                ...base,
                                minWidth: '17rem',
                                padding: '0.5rem',
                                marginRight: '-0.5rem',
                                marginLeft: '-0.5rem'
                            })
                        }}
                    />
                ) : (
                    <span>{`${entry.hour}:00 - ${entry.hour + 1}:00`}</span>
                )}
            </div>
            <div className={styles.classProperty}>
                <span className={styles.title}>Teacher:</span>{' '}
                {isEditing && isAdmin ? (
                    <Select
                        options={teacherOptions}
                        defaultValue={{
                            value: (entry as IGlobalScheduleEntry).instructorId,
                            label: entry.instructorName
                        }}
                        onChange={(selectedTeacher) => {
                            if (selectedTeacher) {
                                setEditedFields({
                                    ...editedFields,
                                    instructorId: selectedTeacher.value
                                });
                            }
                        }}
                        placeholder="Select Teacher"
                        styles={{
                            container: (base) => ({
                                ...base,
                                minWidth: '17rem',
                                padding: '0.5rem',
                                marginRight: '-0.5rem',
                                marginLeft: '-0.5rem'
                            })
                        }}
                    />
                ) : (
                    <span>{entry.instructorName}</span>
                )}
            </div>
            <div className={styles.classProperty}>
                <div className={styles.descriptionActions}>
                    <span className={styles.title}>Description:</span>
                    {user?.role === 'teacher' && !isEditing && (
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
                            value={editedFields.description}
                            onChange={(e) =>
                                setEditedFields({
                                    ...editedFields,
                                    description: e.target.value
                                })
                            }
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
                    <div className={styles.description}>
                        {editedFields.description}
                    </div>
                )}
            </div>
            {user?.role !== 'student' && (
                <div
                    className={`${styles.classProperty} ${isEditing && isAdmin ? styles.editingStudents : ''}`}
                >
                    <span className={styles.title}>Enrolled Students:</span>{' '}
                    {isEditing && isAdmin ? (
                        <Select
                            options={studentOptions}
                            isMulti={true}
                            defaultValue={students
                                .filter((student) =>
                                    editedFields.studentIds.includes(
                                        getIdString(student._id)
                                    )
                                )
                                .map((student) => ({
                                    value: getIdString(student._id),
                                    label: `${student.firstName} ${student.lastName}`
                                }))}
                            onChange={(selectedStudents) => {
                                setEditedFields({
                                    ...editedFields,
                                    studentIds: selectedStudents
                                        ? selectedStudents.map(
                                              (student) => student.value
                                          )
                                        : []
                                });
                            }}
                            placeholder="Select Students"
                            styles={{
                                container: (base) => ({
                                    ...base,
                                    padding: '0.5rem',
                                    marginRight: '-0.5rem',
                                    marginLeft: '-0.5rem'
                                })
                            }}
                            maxMenuHeight={220}
                        />
                    ) : (
                        <div className={styles.students}>
                            {users.map(
                                (user) =>
                                    `${user.firstName} ${user.lastName} \n`
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
