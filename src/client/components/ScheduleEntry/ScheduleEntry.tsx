import {
    IFriendsScheduleEntry,
    IGlobalScheduleEntry,
    IUserScheduleEntry
} from '@/common/types/ISchedule';
import { convertRoomTypeToClassType } from '@/common/utils';
import classTypeIcon from '../../assets/classTypeIcon.svg';
import clockIcon from '../../assets/clockIcon.svg';
import locationIcon from '../../assets/locationIcon.svg';
import userIcon from '../../assets/userIcon.svg';
import styles from './ScheduleEntry.module.css';

interface SchedulEntryProps {
    entry: IUserScheduleEntry | IGlobalScheduleEntry | IFriendsScheduleEntry;
    classType: string[];
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
            style={{ cursor: `${'instructorName' in entry && 'pointer'}` }}
            // className={`${'type' in entry ? styles.globalScheduleEntry : styles.scheduleEntry} ${styles[`${convertRoomTypeToClassType(classType)}`]}`}
            className={`${styles.globalScheduleEntry} ${styles[`${convertRoomTypeToClassType(classType)}`]}`}
        >
            <div className={styles.entryContent}>
                <div className={styles.entryTitle}>{entry.className}</div>
                <div className={styles.entryDetail}>
                    <div className={styles.classProperty}>
                        <img src={classTypeIcon} />{' '}
                        {convertRoomTypeToClassType(entry.classType)}
                    </div>
                    <div className={styles.classProperty}>
                        <img src={locationIcon} /> Room: {entry.roomName}
                    </div>
                    {'instructorName' in entry ? (
                        <div className={styles.classProperty}>
                            <img src={clockIcon} />
                            Time: {entry.hour}:00
                        </div>
                    ) : (
                        <div className={styles.classProperty}>
                            <img src={userIcon} /> Friend: {entry.friendName}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
