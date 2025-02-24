import { fetchAllRoomsRequest } from '@/client/store/slices/roomSlice';
import { closePopUp, openPopUp } from '@/client/store/slices/scheduleSlice';
import { RootState } from '@/client/store/store';
import {
    IGlobalScheduleEntry,
    IUserScheduleEntry
} from '@/common/types/ISchedule';
import { getIdString } from '@/common/utils';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    const { rooms } = useSelector((state: RootState) => state.room);
    const dispatch = useDispatch();

    const [selectedRoom, setSelectedRoom] = useState('');

    useEffect(() => {
        if (globalSchedule) {
            dispatch(fetchAllRoomsRequest({ token }));
        }
    }, [globalSchedule, token, dispatch]);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const hours = Array.from({ length: 10 }, (_, i) => 9 + i);

    const schedule = globalSchedule
        ? globalSchedule
        : userSchedule
          ? userSchedule
          : [];

    const filteredSchedule = selectedRoom
        ? schedule.filter(
              (entry) => 'roomId' in entry && entry.roomId === selectedRoom
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
                    className={`schedulePopUp entry-${popUp.day}`}
                >
                    <ClassDetails key={popUp.classId} entry={popUp} />
                </PopUpCard>
            )}
            <div className={styles.scheduleContainer}>
                <div className={styles.filterContainer}>
                    <div className={styles.filterLabel}>Filter by Room:</div>
                    <select
                        className={styles.dropdown}
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                    >
                        <option value="">All Rooms</option>
                        {rooms &&
                            rooms.map((room) => (
                                <option
                                    key={getIdString(room._id)}
                                    value={getIdString(room._id)}
                                >
                                    {room.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div
                    className={styles.scheduleGrid}
                    style={{ gap: `${globalSchedule && '5px'}` }}
                >
                    <div
                        className={`${styles.gridCell} ${styles.hourLabel}`}
                    ></div>{' '}
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className={`${styles.gridCell} ${styles.dayHeader}`}
                        >
                            {day}
                        </div>
                    ))}
                    {hours.map((hour) => (
                        <React.Fragment key={hour}>
                            <div
                                className={`${styles.gridCell} ${styles.hourLabel}`}
                            >{`${hour}:00`}</div>
                            {days.map((day, dayIndex) => {
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
            </div>
        </>
    );
};

export default Schedule;
