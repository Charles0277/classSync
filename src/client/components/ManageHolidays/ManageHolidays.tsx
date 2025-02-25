import {
    deleteHolidayRequest,
    getAllHolidaysRequest
} from '@/client/store/slices/holidaySlice';
import { IHoliday } from '@/common/types/IHoliday';
import { getIdString } from '@/common/utils';
import { useEffect, useState } from 'react';
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
    const { holidays, loading } = useSelector(
        (state: RootState) => state.holiday
    );
    const dispatch = useDispatch();
    const [holidayToDelete, setHolidayToDelete] = useState<IHoliday | null>(
        null
    );

    useEffect(() => {
        if (token) {
            dispatch(getAllHolidaysRequest({ token }));
        }
    }, [token]);

    const onDeleteHoliday = (holiday: IHoliday) => {
        if (token) {
            dispatch(deleteHolidayRequest({ id: holiday._id, token }));
            setHolidayToDelete(null);
        }
    };

    return (
        <div>
            <div className={styles.addHolidayButton}>
                <Button type="button" onClick={() => onAddEditHoliday()}>
                    <img src={addIcon} alt="Edit" /> Add Holiday
                </Button>
            </div>
            <div className={styles.holidayList}>
                {holidays && holidays.length > 0 ? (
                    holidays.map((holiday, index) => (
                        <div
                            key={getIdString(holiday._id)}
                            className={`${styles.holidayContainer} ${
                                index === holidays.length - 1
                                    ? styles.lastRoom
                                    : ''
                            }`}
                        >
                            <div>
                                {holiday.name}:{' '}
                                {new Date(
                                    holiday.startDate
                                ).toLocaleDateString()}{' '}
                                -{' '}
                                {new Date(holiday.endDate).toLocaleDateString()}
                            </div>
                            <div className={styles.rightSideControl}>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        onAddEditHoliday(holiday);
                                    }}
                                >
                                    <img
                                        src="src/client/assets/editIcon.svg"
                                        alt="Edit"
                                    />
                                </Button>
                                {holidayToDelete?.name === holiday.name ? (
                                    <div
                                        className={
                                            styles.confirmDeleteContainer
                                        }
                                    >
                                        <span>Confirm delete?</span>
                                        <div
                                            className={
                                                styles.confirmDeleteButtonGroup
                                            }
                                        >
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    onDeleteHoliday(holiday)
                                                }
                                            >
                                                Yes
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    setHolidayToDelete(null)
                                                }
                                            >
                                                No
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            setHolidayToDelete(holiday)
                                        }
                                    >
                                        <img
                                            src="src/client/assets/trashIcon.svg"
                                            alt="Delete"
                                        />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                ) : loading ? (
                    <div className={styles.noResults}>Loading dates...</div>
                ) : (
                    <div className={styles.noResults}>No dates found</div>
                )}
            </div>
        </div>
    );
};
