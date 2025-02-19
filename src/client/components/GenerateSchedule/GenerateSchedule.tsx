import { RootState } from '@/client/store/store';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button/Button';
import styles from './GenerateSchedule.module.css';
import { generateGlobalScheduleRequest } from '@/client/store/slices/scheduleSlice';

export const GenerateSchedule: React.FC = () => {
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
            <div className={styles.option}>
                <div className={styles.optionContent}>
                    Genereate Semester 1 Schedule
                    <div className={styles.generateButton}>
                        <Button
                            className="generate"
                            onClick={() => handleSubmit(1)}
                            loading={generateSemester1Loading}
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
                            loading={generateSemester2Loading}
                        >
                            Generate
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
