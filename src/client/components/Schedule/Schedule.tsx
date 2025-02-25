import { fetchAllRoomsRequest } from '@/client/store/slices/roomSlice';
import { closePopUp, openPopUp } from '@/client/store/slices/scheduleSlice';
import { fetchAllStudentsRequest } from '@/client/store/slices/userSlice';
import { RootState } from '@/client/store/store';
import {
    IGlobalScheduleEntry,
    IUserScheduleEntry
} from '@/common/types/ISchedule';
import { convertRoomTypeToClassType, getIdString } from '@/common/utils';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import settingsIcon from '../../assets/settingsIcon.svg';
import Button from '../Button/Button';
import { ClassDetails } from '../ClassDetails/ClassDetails';
import { PopUpCard } from '../ManageConfigCard/PopUpCard';
import { ScheduleEntry } from '../ScheduleEntry/ScheduleEntry';
import styles from './Schedule.module.css';

type ScheduleProps = {
    userSchedule?: IUserScheduleEntry[];
    globalSchedule?: IGlobalScheduleEntry[];
};

const Schedule: React.FC<ScheduleProps> = ({
    userSchedule,
    globalSchedule
}) => {
    const { token } = useSelector((state: RootState) => state.auth);
    const popUp = useSelector((state: RootState) => state.schedule.popUpClass);
    const { rooms, loading } = useSelector((state: RootState) => state.room);
    const { students, studentsLoading } = useSelector(
        (state: RootState) => state.user
    );
    const dispatch = useDispatch();

    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<string[]>([]);
    const [weekOffset, setWeekOffset] = useState(0);

    useEffect(() => {
        if (globalSchedule) {
            dispatch(fetchAllStudentsRequest({ token }));
            dispatch(fetchAllRoomsRequest({ token }));
        }
    }, [globalSchedule, token, dispatch]);

    const getCurrentWeekMonday = (
        baseDate: Date,
        offsetWeeks: number
    ): Date => {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + offsetWeeks * 7);
        const day = date.getDay(); // 0 (Sun) to 6 (Sat)
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
        return new Date(date.setDate(diff));
    };

    const formatScheduleDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const currentMonday = getCurrentWeekMonday(new Date(), weekOffset);
    const daysWithDates = Array.from({ length: 5 }).map((_, index) => {
        const date = new Date(currentMonday);
        date.setDate(date.getDate() + index);
        return {
            name: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][
                index
            ],
            date
        };
    });

    const hours = Array.from({ length: 10 }, (_, i) => 9 + i);

    const schedule = globalSchedule
        ? globalSchedule
        : userSchedule
          ? userSchedule
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

    const filteredSchedule =
        selectedRoom.length > 0 && selectedStudents.length > 0
            ? schedule.filter(
                  (entry) =>
                      'roomId' in entry &&
                      entry.studentIds &&
                      selectedRoom.includes(entry.roomId as string) &&
                      entry.studentIds.some((studentId) =>
                          selectedStudents.includes(studentId)
                      )
              )
            : selectedRoom.length > 0
              ? schedule.filter(
                    (entry) =>
                        'roomId' in entry &&
                        selectedRoom.includes(entry.roomId as string)
                )
              : selectedStudents.length > 0
                ? schedule.filter(
                      (entry) =>
                          entry.studentIds &&
                          entry.studentIds.some((studentId) =>
                              selectedStudents.includes(studentId)
                          )
                  )
                : schedule;

    const scheduleMap: {
        [key: string]: (IUserScheduleEntry | IGlobalScheduleEntry)[];
    } = {};

    filteredSchedule.forEach((entry) => {
        const key = `${entry.day}-${entry.hour}`;
        if (!scheduleMap[key]) scheduleMap[key] = [];
        scheduleMap[key].push(entry);
    });

    return (
        <>
            {popUp && (
                <PopUpCard
                    title="Class Details"
                    onCancel={() => dispatch(closePopUp())}
                    className={`schedulePopUp ${convertRoomTypeToClassType(popUp.classType)}`}
                >
                    <ClassDetails key={popUp.classId} entry={popUp} />
                </PopUpCard>
            )}
            <div
                className={styles.scheduleContainer}
                style={{ width: `${globalSchedule && '1229px'}` }}
            >
                {globalSchedule && (
                    <div className={styles.filterContainer}>
                        <div className={styles.filterLabel}>
                            Filter by Student:
                        </div>
                        <Select
                            options={studentOptions}
                            isMulti
                            onChange={(selectedOptions) => {
                                const selected = selectedOptions
                                    ? selectedOptions.map(
                                          (option: any) => option.value
                                      )
                                    : [];
                                setSelectedStudents(selected);
                            }}
                            placeholder="Search and select students..."
                            styles={{
                                container: (base) => ({
                                    ...base,
                                    minWidth: '17rem'
                                })
                            }}
                            noOptionsMessage={() => {
                                if (studentsLoading) return 'Loading...';
                                return 'No Options';
                            }}
                        />
                        <div className={styles.filterLabel}>
                            Filter by Room:
                        </div>
                        <Select
                            options={roomOptions}
                            isMulti
                            onChange={(selectedOptions) => {
                                const selected = selectedOptions
                                    ? selectedOptions.map(
                                          (option: any) => option.value
                                      )
                                    : [];
                                setSelectedRoom(selected);
                            }}
                            placeholder="Search and select rooms..."
                            styles={{
                                container: (base) => ({
                                    ...base,
                                    minWidth: '17rem'
                                })
                            }}
                            noOptionsMessage={() => {
                                if (loading) return 'Loading...';
                                return 'No Options';
                            }}
                        />
                    </div>
                )}
                <div
                    className={styles.scheduleGrid}
                    style={{ gap: `${globalSchedule && '5px'}` }}
                >
                    <div
                        className={`${styles.gridCell} ${styles.hourLabel}`}
                    ></div>{' '}
                    {daysWithDates.map((day, index) => (
                        <div
                            key={index}
                            className={`${styles.gridCell} ${styles.dayHeader}`}
                        >
                            {day.name} ({formatScheduleDate(day.date)})
                        </div>
                    ))}
                    {hours.map((hour) => (
                        <React.Fragment key={hour}>
                            <div
                                className={`${styles.gridCell} ${styles.hourLabel}`}
                            >{`${hour}:00`}</div>
                            {daysWithDates.map((day, dayIndex) => {
                                const key = `${dayIndex}-${hour}`;
                                const entry = scheduleMap[key];
                                return (
                                    <div
                                        key={dayIndex}
                                        className={styles.gridCell}
                                    >
                                        {scheduleMap[key] &&
                                            scheduleMap[key].map(
                                                (entry, idx, arr) => (
                                                    <div
                                                        key={idx}
                                                        style={{
                                                            width: `${100 / arr.length}%`
                                                        }}
                                                    >
                                                        <ScheduleEntry
                                                            entry={entry}
                                                            classType={
                                                                entry.classType
                                                            }
                                                            onClick={() =>
                                                                dispatch(
                                                                    openPopUp(
                                                                        entry
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                )
                                            )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
                <div
                    className={styles.actionBar}
                    style={{ width: `${globalSchedule && '1229px'}` }}
                >
                    <div className={styles.weekControls}>
                        <Button
                            onClick={() => setWeekOffset((prev) => prev - 1)}
                            style={{
                                borderTopLeftRadius: '0.25rem',
                                borderBottomLeftRadius: '0.25rem',
                                borderBottomRightRadius: '0',
                                borderTopRightRadius: '0'
                            }}
                        >
                            ←
                        </Button>
                        <Button
                            onClick={() => setWeekOffset(0)}
                            style={{ borderRadius: '0' }}
                        >
                            Current Week
                        </Button>
                        <Button
                            onClick={() => setWeekOffset((prev) => prev + 1)}
                            style={{
                                borderTopRightRadius: '0.25rem',
                                borderBottomRightRadius: '0.25rem',
                                borderTopLeftRadius: '0',
                                borderBottomLeftRadius: '0'
                            }}
                        >
                            →
                        </Button>
                    </div>
                    {globalSchedule && (
                        <div className={styles.editClasses}>
                            <Button>Edit Classes</Button>
                        </div>
                    )}
                    <div className={styles.settings}>
                        <Button>
                            <img src={settingsIcon} alt="Settings" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Schedule;
