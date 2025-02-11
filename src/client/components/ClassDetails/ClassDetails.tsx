import { IIndividualScheduleEntry } from '@/common/types/ISchedule';
import { convertRoomTypeToClassType } from '@/common/utils';
import styles from './ClassDetails.module.css';

interface ClassDetailsProps {
    entry: IIndividualScheduleEntry;
}

export const ClassDetails: React.FC<ClassDetailsProps> = ({ entry }) => {
    return (
        <div className={styles.classDetails}>
            <div className={styles.classProperty}>
                <span className={styles.title}>Title:</span>
                {entry.className}
            </div>
            <div className={styles.classProperty}>
                <span className={styles.title}>Room:</span>
                {entry.roomName}
            </div>
            <div className={styles.classProperty}>
                <span className={styles.title}>Class Type:</span>
                {convertRoomTypeToClassType(entry.classType)}
            </div>
            <div className={styles.classProperty}>
                <span className={styles.title}>Time:</span>
                {`${entry.hour}:00 - ${entry.hour + 1}:00`}
            </div>
            <div className={styles.classProperty}>
                <span className={styles.title}>Teacher:</span>
                {entry.instructorName}
            </div>
        </div>
    );
};
