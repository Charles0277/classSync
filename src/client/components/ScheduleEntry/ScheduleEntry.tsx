import { IIndividualScheduleEntry } from '@/common/types/ISchedule';
import { convertRoomTypeToClassType } from '@/common/utils';
import styles from './ScheduleEntry.module.css';

interface SchedulEntryProps {
    entry: IIndividualScheduleEntry;
    day: string;
    onClick: () => void;
}

export const ScheduleEntry: React.FC<SchedulEntryProps> = ({
    entry,
    day,
    onClick
}) => {
    return (
        <div
            onClick={onClick}
            style={{ cursor: 'pointer' }}
            className={`${styles.scheduleEntry} ${styles[`entry-${day.toLowerCase()}`]}`}
        >
            <div className={styles.entryContent}>
                <div className={styles.entryTitle}>{entry.className}</div>
                <div className={styles.entryDetail}>
                    {convertRoomTypeToClassType(entry.classType)}
                    <br />
                    Room: {entry.roomName}
                    <br />
                    Time: {entry.hour}:00
                </div>
            </div>
        </div>
    );
};
