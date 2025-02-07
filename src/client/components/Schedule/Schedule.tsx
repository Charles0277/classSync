import { IIndividualScheduleEntry } from '@/common/types/ISchedule';
import { getIdString } from '@/common/utils';
import React from 'react';
import styles from './Schedule.module.css';

type ScheduleProps = {
    userSchedule: IIndividualScheduleEntry[];
};

const Schedule: React.FC<ScheduleProps> = ({ userSchedule }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
        <div className={styles.scheduleContainer}>
            <div className={styles.scheduleGrid}>
                {days.map((day, index) => (
                    <div key={index} className={styles.scheduleDay}>
                        <div className={styles.scheduleColumn}>
                            <div className={styles.dayHeader}>{day}</div>
                            {userSchedule
                                ?.filter((entry) => entry.day === index + 1)
                                ?.map((entry) => (
                                    <div
                                        key={getIdString(entry._id)}
                                        className={`${styles.scheduleEntry} ${styles[`entry-${day.toLowerCase()}`]}`}
                                        style={{
                                            top: `${(entry.hour - 9) * 65}px`
                                        }}
                                    >
                                        <div className={styles.entryContent}>
                                            <div className={styles.entryTitle}>
                                                {entry.className}
                                            </div>
                                            <div className={styles.entryDetail}>
                                                Room: {entry.roomName} <br />
                                                Time: {entry.hour}:00
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Schedule;
