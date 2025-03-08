import {
    createClassRequest,
    deleteClassRequest,
    getClassRequest,
    resetClassEntity,
    resetCreatedClassId,
    updateClassRequest
} from '@/client/store/slices/classSlice';
import { fetchAllCourseUnitsRequest } from '@/client/store/slices/courseUnitSlice';
import {
    addGlobalScheduleEntryRequest,
    checkForConflictsRequest,
    closePopUp,
    deleteGlobalScheduleEntryRequest,
    setIsNewClass,
    updateGlobalScheduleEntryRequest
} from '@/client/store/slices/scheduleSlice';
import {
    fetchAllTeachersRequest,
    fetchUsersRequest,
    resetStudents
} from '@/client/store/slices/userSlice';
import { RootState } from '@/client/store/store';
import {
    IGlobalScheduleEntry,
    IUserScheduleEntry
} from '@/common/types/ISchedule';
import { convertRoomTypeToClassType, getIdString } from '@/common/utils';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import Button from '../Button/Button';
import styles from './ClassDetails.module.css';

interface ClassDetailsProps {
    entry: IUserScheduleEntry | IGlobalScheduleEntry;
    isNewClass?: boolean;
}

export const ClassDetails: React.FC<ClassDetailsProps> = ({
    entry,
    isNewClass = false
}) => {
    const { classEntity, createdClassId } = useSelector(
        (state: RootState) => state.class
    );
    const { token, user } = useSelector((state: RootState) => state.auth);
    const { users, students } = useSelector((state: RootState) => state.user);
    const { rooms } = useSelector((state: RootState) => state.room);
    const { teachers } = useSelector((state: RootState) => state.user);
    const { courseUnits } = useSelector((state: RootState) => state.courseUnit);
    const { conflicts, checkingConflicts, globalSchedule } = useSelector(
        (state: RootState) => state.schedule
    );

    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(isNewClass);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editedFields, setEditedFields] = useState({
        className: isNewClass ? '' : entry.className,
        courseUnitId: '',
        roomId: isNewClass ? '' : (entry as IGlobalScheduleEntry).roomId,
        classType: isNewClass ? null : entry.classType,
        hour: isNewClass ? 9 : entry.hour,
        day: isNewClass ? 0 : (entry as IGlobalScheduleEntry).day,
        instructorId: isNewClass
            ? ''
            : (entry as IGlobalScheduleEntry).instructorId,
        description: isNewClass
            ? ''
            : classEntity?.description || 'No description provided.',
        studentIds: isNewClass
            ? null
            : (entry as IGlobalScheduleEntry).studentIds
    });
    const [showConflictConfirm, setShowConflictConfirm] = useState(false);
    const [pendingSave, setPendingSave] = useState(false);

    const isAdmin = user?.role === 'admin';

    const hasChanges = useMemo(() => {
        if (isNewClass) {
            return (
                editedFields.className.trim() !== '' &&
                editedFields.courseUnitId !== '' &&
                editedFields.roomId !== '' &&
                editedFields.classType !== null &&
                editedFields.instructorId !== '' &&
                editedFields.studentIds !== null &&
                editedFields.studentIds.length > 0
            );
        } else {
            const originalEntry = entry as IGlobalScheduleEntry;
            const originalDescription =
                classEntity?.description || 'No description provided.';
            const originalStudentIds = originalEntry.studentIds;

            const classNameChanged =
                editedFields.className !== originalEntry.className;
            const roomIdChanged = editedFields.roomId !== originalEntry.roomId;
            const classTypeChanged =
                JSON.stringify(editedFields.classType) !==
                JSON.stringify(originalEntry.classType);
            const hourChanged = editedFields.hour !== originalEntry.hour;
            const dayChanged = editedFields.day !== originalEntry.day;
            const instructorIdChanged =
                editedFields.instructorId !== originalEntry.instructorId;
            const descriptionChanged =
                editedFields.description !== originalDescription;

            const sortedEditedStudentIds = [...(editedFields.studentIds || [])]
                .sort()
                .toString();
            const sortedOriginalStudentIds = [...(originalStudentIds || [])]
                .sort()
                .toString();
            const studentIdsChanged =
                sortedEditedStudentIds !== sortedOriginalStudentIds;

            return (
                classNameChanged ||
                roomIdChanged ||
                classTypeChanged ||
                hourChanged ||
                dayChanged ||
                instructorIdChanged ||
                descriptionChanged ||
                studentIdsChanged
            );
        }
    }, [editedFields, entry, isNewClass]);

    useEffect(() => {
        if (
            !isNewClass &&
            token &&
            getIdString(classEntity?._id) !== entry.classId
        ) {
            dispatch(getClassRequest({ token, id: entry.classId }));
        }
    }, [isNewClass, dispatch, token, entry.classId, classEntity?._id]);

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
        if (isNewClass && courseUnits.length === 0) {
            dispatch(fetchAllCourseUnitsRequest());
        }
    }, [dispatch, token, isNewClass, courseUnits, isAdmin]);

    useEffect(() => {
        setEditedFields((fields) => ({
            ...fields,
            description: classEntity?.description || 'No description provided.'
        }));
    }, [classEntity?.description]);

    useEffect(() => {
        return () => {
            dispatch(resetClassEntity());
            dispatch(resetStudents());
        };
    }, [dispatch]);

    useEffect(() => {
        if (teachers.length === 0 && isAdmin) {
            dispatch(fetchAllTeachersRequest({ token }));
        }
    }, [dispatch, token, teachers, isAdmin]);

    useEffect(() => {
        if (createdClassId) {
            dispatch(
                addGlobalScheduleEntryRequest({
                    token,
                    formData: {
                        classId: createdClassId,
                        roomId: editedFields.roomId,
                        day: editedFields.day,
                        hour: editedFields.hour,
                        instructorId: editedFields.instructorId,
                        studentIds: editedFields.studentIds
                    }
                })
            );

            dispatch(resetCreatedClassId());
        }
    }, [dispatch, token, createdClassId]);

    useEffect(() => {
        if (checkingConflicts) {
            return;
        }
        if (
            pendingSave &&
            conflicts &&
            (conflicts.instructorConflicts.length > 0 ||
                conflicts.roomConflicts.length > 0 ||
                conflicts.studentConflicts.length > 0)
        ) {
            setShowConflictConfirm(true);
            setPendingSave(false);
        } else if (pendingSave && !isNewClass) {
            handleSave();
            setPendingSave(false);
        } else if (pendingSave && isNewClass) {
            handleCreate();
            setPendingSave(false);
        }
    }, [conflicts, pendingSave, checkingConflicts, isNewClass]);

    const teacherOptions = teachers
        ? teachers.map((teacher) => ({
              value: teacher._id,
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
              value: room._id,
              label: room.name
          }))
        : [];

    const courseUnitOptions = courseUnits
        ? courseUnits.map((courseUnit) => ({
              value: courseUnit._id,
              label: courseUnit.name
          }))
        : [];

    const classTypesOptions = [
        { value: ['lectureTheatre'], label: 'Lecture' },
        { value: ['laboratory'], label: 'Laboratory' },
        { value: ['workshop'], label: 'Workshop' },
        { value: ['seminar'], label: 'Seminar' },
        { value: ['office'], label: 'Meeting' }
    ];

    const dayOptions = [
        { value: 0, label: 'Monday' },
        { value: 1, label: 'Tuesday' },
        { value: 2, label: 'Wednesday' },
        { value: 3, label: 'Thursday' },
        { value: 4, label: 'Friday' }
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

    const handleConflictCheck = () => {
        const changedScheduleFields: Record<string, any> = {};

        if (editedFields.hour !== entry.hour) {
            changedScheduleFields.hour = editedFields.hour;
        }
        if (editedFields.day !== (entry as IGlobalScheduleEntry).day) {
            changedScheduleFields.day = editedFields.day;
        }

        if (
            editedFields.instructorId !==
            (entry as IGlobalScheduleEntry).instructorId
        ) {
            changedScheduleFields.instructorId = editedFields.instructorId;
        }
        if (editedFields.roomId !== (entry as IGlobalScheduleEntry).roomId) {
            changedScheduleFields.roomId = editedFields.roomId;
        }
        const sortedEditedStudentIds = [...editedFields.studentIds!]
            .sort()
            .toString();
        const sortedEntryStudentIds = [
            ...(entry as IGlobalScheduleEntry).studentIds
        ]
            .sort()
            .toString();
        if (sortedEditedStudentIds !== sortedEntryStudentIds) {
            changedScheduleFields.studentIds = editedFields.studentIds;
        }

        if (Object.keys(changedScheduleFields).length > 0) {
            dispatch(
                checkForConflictsRequest({
                    token,
                    formData: { ...entry, ...changedScheduleFields }
                })
            );
        }

        setPendingSave(true);
    };

    const handleSave = () => {
        if (!classEntity?._id) return;
        const changedClassFields: Record<string, any> = {};
        const changedScheduleFields: Record<string, any> = {};

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
        if (editedFields.roomId !== (entry as IGlobalScheduleEntry).roomId) {
            changedScheduleFields.roomId = editedFields.roomId;
        }
        if (editedFields.hour !== entry.hour) {
            changedScheduleFields.hour = editedFields.hour;
        }
        if (editedFields.day !== (entry as IGlobalScheduleEntry).day) {
            changedScheduleFields.day = editedFields.day;
        }

        const sortedEditedStudentIds = [...editedFields.studentIds!]
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

    const resetEditedFields = () => {
        setEditedFields({
            className: entry.className,
            courseUnitId: '',
            roomId: (entry as IGlobalScheduleEntry).roomId,
            classType: entry.classType,
            hour: entry.hour,
            day: (entry as IGlobalScheduleEntry).day,
            instructorId: (entry as IGlobalScheduleEntry).instructorId,
            description: classEntity?.description || 'No description provided.',
            studentIds: (entry as IGlobalScheduleEntry).studentIds
        });
    };

    const handleCancel = (cancelOverride?: boolean) => {
        if (cancelOverride) {
            setShowConflictConfirm(false);
        } else {
            resetEditedFields();
            setIsEditing(false);
        }
    };

    const handleCreate = () => {
        dispatch(
            createClassRequest({
                token,
                formData: {
                    name: editedFields.className,
                    courseUnit: editedFields.courseUnitId,
                    instructor: editedFields.instructorId,
                    classTypes: editedFields.classType,
                    description: editedFields.description,
                    students: editedFields.studentIds
                }
            })
        );
    };

    const handleCancelAddClass = () => {
        dispatch(closePopUp());
        dispatch(setIsNewClass(false));
    };

    if (showConflictConfirm) {
        return (
            <div className={styles.conflictPopup}>
                <div className={styles.conflictContent}>
                    <div className={styles.conflictHeader}>
                        Scheduling Conflicts Detected
                    </div>
                    <div className={styles.conflictMessage}>
                        There are conflicts with the following classes:
                    </div>

                    {conflicts && conflicts.instructorConflicts.length > 0 && (
                        <div className={styles.conflictCategory}>
                            <div className={styles.conflictCategoryTitle}>
                                {conflicts.instructorConflicts.length > 1
                                    ? 'Instructor Conflicts with Classes:'
                                    : 'Instructor Conflict with Class:'}
                            </div>
                            {conflicts.instructorConflicts.map((conflict) => (
                                <div
                                    key={getIdString(conflict._id)}
                                    className={styles.conflictItem}
                                >
                                    {
                                        globalSchedule?.find(
                                            (entry) =>
                                                entry._id === conflict._id
                                        )?.className
                                    }
                                </div>
                            ))}
                        </div>
                    )}

                    {conflicts && conflicts.roomConflicts.length > 0 && (
                        <div className={styles.conflictCategory}>
                            <div className={styles.conflictCategoryTitle}>
                                {conflicts.roomConflicts.length > 1
                                    ? 'Room Conflicts with Classes:'
                                    : 'Room Conflict with Class:'}
                            </div>
                            {conflicts.roomConflicts.map((conflict) => (
                                <div
                                    key={getIdString(conflict._id)}
                                    className={styles.conflictItem}
                                >
                                    {
                                        globalSchedule?.find(
                                            (entry) =>
                                                entry._id === conflict._id
                                        )?.className
                                    }
                                </div>
                            ))}
                        </div>
                    )}

                    {conflicts && conflicts.studentConflicts.length > 0 && (
                        <div className={styles.conflictCategory}>
                            <div className={styles.conflictCategoryTitle}>
                                {conflicts.studentConflicts.length > 1
                                    ? 'Student Conflicts with Classes:'
                                    : 'Student Conflict with Class:'}
                            </div>
                            {conflicts.studentConflicts.map((conflict) => (
                                <div
                                    key={getIdString(conflict._id)}
                                    className={styles.conflictItem}
                                >
                                    {
                                        globalSchedule?.find(
                                            (entry) =>
                                                entry._id === conflict._id
                                        )?.className
                                    }
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={styles.conflictMessage}>
                        Do you want to proceed with saving anyway?
                    </div>

                    <div className={styles.buttonGroup}>
                        <Button
                            type="button"
                            className="classDetailsCancel"
                            onClick={() => handleCancel(true)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            className="classDetailsSave"
                            onClick={() => {
                                setShowConflictConfirm(false);
                                isNewClass ? handleCreate() : handleSave();
                            }}
                        >
                            Proceed
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.classDetails}>
            {isAdmin && !isEditing && !isNewClass && (
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
                {(isEditing || isNewClass) && isAdmin ? (
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
            {isNewClass && (
                <div className={styles.classProperty}>
                    <span className={styles.title}>Course Unit:</span>
                    {isEditing && isAdmin ? (
                        <Select
                            options={courseUnitOptions}
                            value={courseUnitOptions.find(
                                (option) =>
                                    getIdString(option.value) ===
                                    editedFields.courseUnitId
                            )}
                            onChange={(selectedCourseUnit) => {
                                if (selectedCourseUnit) {
                                    setEditedFields({
                                        ...editedFields,
                                        courseUnitId: getIdString(
                                            selectedCourseUnit.value
                                        )
                                    });
                                }
                            }}
                            placeholder="Select a Course Unit"
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
                        <span>
                            {
                                courseUnits.find(
                                    (courseUnit) =>
                                        courseUnit._id ===
                                        classEntity?.courseUnit
                                )?.name
                            }
                        </span>
                    )}
                </div>
            )}
            <div className={styles.classProperty}>
                <span className={styles.title}>Room:</span>
                {(isEditing || isNewClass) && isAdmin ? (
                    <Select
                        options={roomOptions}
                        value={roomOptions.find(
                            (option) => option.value === editedFields.roomId
                        )}
                        onChange={(selectedRoom) => {
                            if (selectedRoom) {
                                setEditedFields({
                                    ...editedFields,
                                    roomId: selectedRoom.value
                                });
                            }
                        }}
                        placeholder="Select a Room"
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
                {(isEditing || isNewClass) && isAdmin ? (
                    <Select
                        options={classTypesOptions}
                        value={classTypesOptions.find(
                            (option) =>
                                JSON.stringify(option.value) ===
                                JSON.stringify(editedFields.classType)
                        )}
                        onChange={(selectedClassType) => {
                            if (selectedClassType) {
                                setEditedFields({
                                    ...editedFields,
                                    classType: selectedClassType.value
                                });
                            }
                        }}
                        placeholder="Select a Class Type"
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
                {(isEditing || isNewClass) && isAdmin ? (
                    <Select
                        options={timeOptions}
                        value={timeOptions.find(
                            (option) => option.value === editedFields.hour
                        )}
                        onChange={(selectedTime) => {
                            if (selectedTime) {
                                setEditedFields({
                                    ...editedFields,
                                    hour: selectedTime.value
                                });
                            }
                        }}
                        placeholder="Select a Time"
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
                <span className={styles.title}>Day:</span>{' '}
                {(isEditing || isNewClass) && isAdmin ? (
                    <Select
                        options={dayOptions}
                        value={dayOptions.find(
                            (option) => option.value === editedFields.day
                        )}
                        onChange={(selectedDay) => {
                            if (selectedDay) {
                                setEditedFields({
                                    ...editedFields,
                                    day: selectedDay.value
                                });
                            }
                        }}
                        placeholder="Select a Day"
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
                    <span>
                        {dayOptions[(entry as IGlobalScheduleEntry).day].label}
                    </span>
                )}
            </div>
            <div className={styles.classProperty}>
                <span className={styles.title}>Teacher:</span>{' '}
                {(isEditing || isNewClass) && isAdmin ? (
                    <Select
                        options={teacherOptions}
                        value={teacherOptions.find(
                            (option) =>
                                option.value === editedFields.instructorId
                        )}
                        onChange={(selectedTeacher) => {
                            if (selectedTeacher) {
                                setEditedFields({
                                    ...editedFields,
                                    instructorId: selectedTeacher.value
                                });
                            }
                        }}
                        placeholder="Select a Teacher"
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
                    {user?.role === 'teacher' && !isEditing && !isNewClass && (
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
                                onClick={
                                    isNewClass
                                        ? handleCancelAddClass
                                        : () => handleCancel()
                                }
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                className="classDetailsSave"
                                onClick={handleConflictCheck}
                                disabled={!hasChanges}
                            >
                                {isNewClass ? 'Add' : 'Save'}
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
                            isMulti
                            options={studentOptions}
                            value={studentOptions.filter((option) =>
                                editedFields.studentIds?.includes(option.value)
                            )}
                            onChange={(selectedStudents) => {
                                setEditedFields({
                                    ...editedFields,
                                    studentIds: selectedStudents.map(
                                        (student) => student.value
                                    )
                                });
                            }}
                            placeholder="Select Student(s)"
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
