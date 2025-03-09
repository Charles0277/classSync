import {
    generateGlobalScheduleRequest,
    resetSemester1GlobalScheduleGenerated,
    resetSemester2GlobalScheduleGenerated
} from '@/client/store/slices/scheduleSlice';
import { RootState } from '@/client/store/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Button from '../Button/Button';
import styles from './ManageSchedules.module.css';

export const ManageSchedules = () => {
    const { token } = useSelector((state: RootState) => state.auth);
    const {
        generateSemester1Loading,
        generateSemester2Loading,
        isSemester1GlobalScheduleGenerated,
        isSemester2GlobalScheduleGenerated,
        error
    } = useSelector((state: RootState) => state.schedule);

    const dispatch = useDispatch();

    useEffect(() => {
        if (isSemester1GlobalScheduleGenerated) {
            toast.success('Semester 1 schedule generated successfully! 🎉');
            dispatch(resetSemester1GlobalScheduleGenerated());
        }
        if (isSemester2GlobalScheduleGenerated) {
            toast.success('Semester 2 schedule generated successfully! 🎉');
            dispatch(resetSemester2GlobalScheduleGenerated());
        }
        if (error) {
            toast.error(`Schedule generation failed: ${error}`);
        }
    }, [
        isSemester1GlobalScheduleGenerated,
        isSemester2GlobalScheduleGenerated,
        error
    ]);

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
