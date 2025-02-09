import React from 'react';
import { IIndividualScheduleEntry } from '@/common/types/ISchedule';
import { convertRoomTypeToClassType } from '@/common/utils';
import styles from './Schedule.module.css';

type ScheduleProps = {
    userSchedule: IIndividualScheduleEntry[];
};

const Schedule: React.FC<ScheduleProps> = ({ userSchedule }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const hours = Array.from({ length: 10 }, (_, i) => 9 + i);

    const scheduleMap: { [key: string]: IIndividualScheduleEntry } = {};

    userSchedule.forEach((entry) => {
        const key = `${entry.day}-${entry.hour}`;
        scheduleMap[key] = entry;
    });

    return (
        <div className={styles.scheduleContainer}>
            <div className={styles.scheduleGrid}>
                <div className={styles.gridCell}></div>{' '}
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
                                <div key={dayIndex} className={styles.gridCell}>
                                    {entry && (
                                        <div
                                            className={`${styles.scheduleEntry} ${styles[`entry-${day.toLowerCase()}`]}`}
                                        >
                                            <div
                                                className={styles.entryContent}
                                            >
                                                <div
                                                    className={
                                                        styles.entryTitle
                                                    }
                                                >
                                                    {entry.className}
                                                </div>
                                                <div
                                                    className={
                                                        styles.entryDetail
                                                    }
                                                >
                                                    {convertRoomTypeToClassType(
                                                        entry.classType
                                                    )}
                                                    <br />
                                                    Room: {entry.roomName}
                                                    <br />
                                                    Time: {entry.hour}:00
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Schedule;
