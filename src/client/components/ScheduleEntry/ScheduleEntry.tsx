import {
    IGlobalScheduleEntry,
    IIndividualScheduleEntry
} from '@/common/types/ISchedule';
import { convertRoomTypeToClassType } from '@/common/utils';
import styles from './ScheduleEntry.module.css';

interface SchedulEntryProps {
    entry: IIndividualScheduleEntry | IGlobalScheduleEntry;
    classType: string;
    onClick: () => void;
}

export const ScheduleEntry: React.FC<SchedulEntryProps> = ({
    entry,
    classType,
    onClick
}) => {
    return (
        <div
            onClick={onClick}
            style={{ cursor: 'pointer' }}
            className={`${'type' in entry ? styles.globalScheduleEntry : styles.scheduleEntry} ${styles[`${convertRoomTypeToClassType(classType)}`]}`}
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
