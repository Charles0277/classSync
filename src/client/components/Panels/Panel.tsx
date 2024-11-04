import React, { useEffect, useState } from 'react';
import Button from '../Button/Button';
import Input from '../Input/Input';
import styles from './Panel.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
    getConfigRequest,
    updateConfigRequest
} from '../../store/slices/schoolWeekConfigSlice';
import { RootState } from '../../store/store';
import ManageCardConfig from '../ManageConfigCard/ManageConfigCard';

interface CardProps {
    title: string;
    rightSideControl: 'button' | 'input';
    min?: number;
    max?: number;
}

const Panel: React.FC<CardProps> = ({ title, rightSideControl, min, max }) => {
    const { token } = useSelector((state: RootState) => state.auth);
    const { schoolWeekConfig } = useSelector(
        (state: RootState) => state.schoolWeekConfig
    );

    const [value, setValue] = useState<string>('');
    const [initialValue, setInitialValue] = useState<string>(''); // New state for the original value
    const [showPopup, setShowPopup] = useState(false);

    const dispatch = useDispatch();
    const handleOpenPopup = () => setShowPopup(true);
    const handleClosePopup = () => setShowPopup(false);

    useEffect(() => {
        token && dispatch(getConfigRequest({ token: token }));
    }, [token]);

    useEffect(() => {
        if (schoolWeekConfig && title === 'Days per week') {
            const days = schoolWeekConfig.daysPerWeek.toString();
            setValue(days);
            setInitialValue(days);
        }
        if (schoolWeekConfig && title === 'Hours per day') {
            const hours = schoolWeekConfig.hoursPerDay.toString();
            setValue(hours);
            setInitialValue(hours);
        }
    }, [schoolWeekConfig]);

    useEffect(() => {
        if (value !== initialValue && token && schoolWeekConfig) {
            if (title === 'Days per week') {
                const updatedConfig = {
                    ...schoolWeekConfig,
                    ...{ daysPerWeek: Number(value) }
                };
                dispatch(updateConfigRequest({ token, updatedConfig }));
            }
            if (title === 'Hours per day') {
                const updatedConfig = {
                    ...schoolWeekConfig,
                    ...{ hoursPerDay: Number(value) }
                };
                dispatch(updateConfigRequest({ token, updatedConfig }));
            }
        }
    }, [value, initialValue, token, title, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        const wholeNumberPattern = /^-?\d*$/;

        if (!wholeNumberPattern.test(newValue)) {
            return;
        }

        const numericValue = parseFloat(newValue);

        if (!isNaN(numericValue)) {
            if (min !== undefined && numericValue < min) {
                setValue(min.toString());
            } else if (max !== undefined && numericValue > max) {
                setValue(max.toString());
            } else {
                setValue(newValue);
            }
        } else {
            setValue(newValue);
        }
    };

    return (
        <>
            {showPopup && (
                <ManageCardConfig
                    title={`Manage ${title}`}
                    onCancel={handleClosePopup}
                    onConfirm={handleClosePopup}
                />
            )}
            <div className={styles.panel}>
                {title}
                {rightSideControl === 'button' ? (
                    <Button
                        className="rightSideControl"
                        onClick={() => {
                            handleOpenPopup();
                        }}
                    >
                        Manage
                    </Button>
                ) : (
                    <Input
                        id="input"
                        name="input"
                        type="number"
                        className="rightSideControl"
                        min={min}
                        max={max}
                        value={value}
                        onChange={handleChange}
                        step={1}
                        pattern={`^-?[${min}-${max}]+$`}
                        title={`Only whole numbers between ${min}-${max} are allowed`} // Message that appears if the pattern is not met
                    ></Input>
                )}
            </div>
        </>
    );
};

export default Panel;
