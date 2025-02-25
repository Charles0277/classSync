import { getAllHolidaysRequest } from '@/client/store/slices/holidaySlice';
import { IHoliday } from '@/common/types/IHoliday';
import { getIdString } from '@/common/utils';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import addIcon from '../../assets/addIcon.svg';
import { RootState } from '../../store/store.ts';
import Button from '../Button/Button.tsx';
import styles from './ManageHolidays.module.css';

interface ManageHolidaysProps {
    onAddEditHoliday: (holiday?: IHoliday) => void;
}

export const ManageHolidays: React.FC<ManageHolidaysProps> = ({
    onAddEditHoliday
}) => {
    const { token } = useSelector((state: RootState) => state.auth);
    const { holidays } = useSelector((state: RootState) => state.holiday);
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            dispatch(getAllHolidaysRequest({ token }));
        }
    }, [token]);

    return (
        <div>
            <div className={styles.addHolidayButton}>
                <Button type="button" onClick={() => onAddEditHoliday()}>
                    <img src={addIcon} alt="Edit" /> Add Holiday
                </Button>
            </div>
            <div className={styles.schoolDates}>
                {holidays &&
                    holidays.map((holiday) => (
                        <div
                            key={getIdString(holiday._id)}
                            className={styles.holidayContainer}
                        >
                            {holiday.name}:
                            <div className={styles.dates}>
                                {new Date(
                                    holiday.startDate
                                ).toLocaleDateString()}{' '}
                                -{' '}
                                {new Date(holiday.endDate).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};
