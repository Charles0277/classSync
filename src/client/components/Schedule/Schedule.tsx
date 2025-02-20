import { closePopUp, openPopUp } from '@/client/store/slices/scheduleSlice';
import { RootState } from '@/client/store/store';
import {
    GlobalSchedule,
    IIndividualScheduleEntry
} from '@/common/types/ISchedule';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ClassDetails } from '../ClassDetails/ClassDetails';
import { PopUpCard } from '../ManageConfigCard/PopUpCard';
import { ScheduleEntry } from '../ScheduleEntry/ScheduleEntry';
import styles from './Schedule.module.css';

type ScheduleProps = {
    userSchedule?: IIndividualScheduleEntry[];
    globalSchedule?: GlobalSchedule;
};

const Schedule: React.FC<ScheduleProps> = ({
    userSchedule,
    globalSchedule
}) => {
    const popUp = useSelector((state: RootState) => state.schedule.popUpClass);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const hours = Array.from({ length: 10 }, (_, i) => 9 + i);

    const dispatch = useDispatch();
    const scheduleMap: { [key: string]: IIndividualScheduleEntry } = {};

    if (userSchedule) {
        userSchedule.forEach((entry) => {
            const key = `${entry.day}-${entry.hour}`;
            scheduleMap[key] = entry;
        });
    }

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
                <div className={styles.scheduleGrid}>
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
                                        {entry && (
                                            <ScheduleEntry
                                                entry={entry}
                                                day={day}
                                                onClick={() => {
                                                    dispatch(openPopUp(entry));
                                                }}
                                            />
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
