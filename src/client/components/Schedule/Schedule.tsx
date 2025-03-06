import { getAllHolidaysRequest } from '@/client/store/slices/holidaySlice';
import { fetchAllRoomsRequest } from '@/client/store/slices/roomSlice';
import {
    closePopUp,
    openPopUp,
    setIsNewClass
} from '@/client/store/slices/scheduleSlice';
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
    const { popUpEntry, isNewClass } = useSelector(
        (state: RootState) => state.schedule
    );
    const { rooms, loading } = useSelector((state: RootState) => state.room);
    const { students, studentsLoading } = useSelector(
        (state: RootState) => state.user
    );
    const { holidays } = useSelector((state: RootState) => state.holiday);
    const dispatch = useDispatch();

    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [SelectedRooms, setSelectedRooms] = useState<string[]>([]);
    const [weekOffset, setWeekOffset] = useState(0);
    const [animationClass, setAnimationClass] = useState('');

    useEffect(() => {
        if (!globalSchedule) return;
        if (students.length === 0) {
            dispatch(fetchAllStudentsRequest({ token }));
        }
        if (rooms.length === 0) {
            dispatch(fetchAllRoomsRequest({ token }));
        }
    }, [globalSchedule, token, dispatch, students, rooms]);

    useEffect(() => {
        if (holidays.length === 0) {
            dispatch(getAllHolidaysRequest({ token }));
        }
    }, [holidays]);

    const holidayDates = holidays.map((holiday) => ({
        from: new Date(holiday.startDate),
        to: new Date(holiday.endDate)
    }));

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
        SelectedRooms.length > 0 && selectedStudents.length > 0
            ? schedule.filter(
                  (entry) =>
                      'roomId' in entry &&
                      entry.studentIds &&
                      SelectedRooms.includes(getIdString(entry.roomId)) &&
                      entry.studentIds.some((studentId) =>
                          selectedStudents.includes(studentId)
                      )
              )
            : SelectedRooms.length > 0
              ? schedule.filter(
                    (entry) =>
                        'roomId' in entry &&
                        SelectedRooms.includes(getIdString(entry.roomId))
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

    const handleAddClass = () => {
        dispatch(
            openPopUp({
                className: '',
                roomName: '',
                classType: [],
                hour: 9,
                instructorName: '',
                day: 0,
                classId: '',
                studentIds: []
            })
        );
        dispatch(setIsNewClass(true));
    };

    const handleWeekChange = (offset: number) => {
        if (offset === 0) {
            setAnimationClass(styles.fadePop);
        } else {
            setAnimationClass(styles.fadeSmooth);
        }
        setTimeout(() => {
            if (offset === 0) {
                setWeekOffset(0);
            } else {
                setWeekOffset((prev) => prev + offset);
            }
            setAnimationClass('');
        }, 200);
    };

    return (
        <>
            {popUpEntry && (
                <PopUpCard
                    title="Class Details"
                    onCancel={() => {
                        dispatch(closePopUp());
                        dispatch(setIsNewClass(false));
                    }}
                    className={`schedulePopUp ${convertRoomTypeToClassType(
                        popUpEntry.classType
                    )}`}
                >
                    <ClassDetails
                        key={getIdString(popUpEntry.classId)}
                        entry={popUpEntry}
                        isNewClass={isNewClass}
                    />
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
                                setSelectedRooms(selected);
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
                    className={`${styles.scheduleGrid} ${animationClass}`}
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
                                return (
                                    <div
                                        key={dayIndex}
                                        className={styles.gridCell}
                                    >
                                        {!holidayDates.some(
                                            (holiday) =>
                                                day.date >= holiday.from &&
                                                day.date <= holiday.to
                                        ) &&
                                            scheduleMap[key] &&
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
                            onClick={() => handleWeekChange(-1)}
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
                            onClick={() => handleWeekChange(0)}
                            style={{ borderRadius: '0' }}
                        >
                            Current Week
                        </Button>
                        <Button
                            onClick={() => handleWeekChange(1)}
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
                            <Button onClick={handleAddClass}>
                                Add a Class
                            </Button>
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
