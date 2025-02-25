import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { RangeDatePicker } from '../RangeDatePicker/RangeDatePicker';
import styles from './ManageSchoolDates.module.css';

export const ManageSchoolDates = () => {
    const { token } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch();

    return (
        <div className={styles.schoolDates}>
            <div className={styles.holidayContainer}>
                Christmas:
                <div className={styles.rangeDatePicker}>
                    <RangeDatePicker />
                </div>
            </div>
            <div className={styles.holidayContainer}>
                Christmas:
                <div className={styles.rangeDatePicker}>
                    <RangeDatePicker />
                </div>
            </div>
            <div className={styles.holidayContainer}>
                Christmas:
                <div className={styles.rangeDatePicker}>
                    <RangeDatePicker />
                </div>
            </div>
        </div>
    );
};
