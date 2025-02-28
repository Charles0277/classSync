import { generateGlobalScheduleRequest } from '@/client/store/slices/scheduleSlice';
import { RootState } from '@/client/store/store';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button/Button';
import styles from './ManageSchedules.module.css';

export const ManageSchedules = () => {
    const { token } = useSelector((state: RootState) => state.auth);
    const { generateSemester1Loading, generateSemester2Loading } = useSelector(
        (state: RootState) => state.schedule
    );

    const dispatch = useDispatch();

    const handleSubmit = (semester: number) => {
        dispatch(generateGlobalScheduleRequest({ semester, token }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                Generate Semester 1 Schedule
                <Button
                    className="generate"
                    onClick={() => handleSubmit(1)}
                    loading={generateSemester1Loading}
                >
                    Generate
                </Button>
            </div>
            <div className={styles.container}>
                <div className={styles.row}>
                    Generate Semester 2 Schedule
                    <Button
                        className="generate"
                        onClick={() => handleSubmit(2)}
                        loading={generateSemester2Loading}
                    >
                        Generate
                    </Button>
                </div>
            </div>
        </div>
    );
};
