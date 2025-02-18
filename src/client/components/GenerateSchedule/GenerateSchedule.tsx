import { RootState } from '@/client/store/store';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button/Button';
import styles from './GenerateSchedule.module.css';
import { generateGlobalScheduleRequest } from '@/client/store/slices/scheduleSlice';

export const GenerateSchedule: React.FC = () => {
    const { token } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch();

    const handleSubmit = (semester: number) => {
        dispatch(generateGlobalScheduleRequest({ semester, token }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.option}>
                <div className={styles.optionContent}>
                    Genereate Semester 1 Schedule
                    <div className={styles.generateButton}>
                        <Button
                            className="generate"
                            onClick={() => handleSubmit(1)}
                        >
                            Generate
                        </Button>
                    </div>
                </div>
            </div>
            <div className={styles.option}>
                <div className={styles.optionContent}>
                    Genereate Semester 2 Schedule
                    <div className={styles.generateButton}>
                        <Button
                            className="generate"
                            onClick={() => handleSubmit(2)}
                        >
                            Generate
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
