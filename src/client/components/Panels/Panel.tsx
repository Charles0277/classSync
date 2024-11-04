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

const configMap = {
    'Days per week': 'daysPerWeek',
    'Hours per day': 'hoursPerDay',
    'Start hour': 'startHour',
    'End hour': 'endHour'
} as const;

const Panel: React.FC<CardProps> = ({ title, rightSideControl, min, max }) => {
    const { token } = useSelector((state: RootState) => state.auth);
    const { schoolWeekConfig } = useSelector(
        (state: RootState) => state.schoolWeekConfig
    );

    const [value, setValue] = useState<string>('');
    const [initialValue, setInitialValue] = useState<string>('');
    const [showPopup, setShowPopup] = useState(false);

    const dispatch = useDispatch();
    const configKey = configMap[title as keyof typeof configMap];

    const handleOpenPopup = () => setShowPopup(true);
    const handleClosePopup = () => setShowPopup(false);

    useEffect(() => {
        if (token) {
            dispatch(getConfigRequest({ token }));
        }
    }, [token]);

    useEffect(() => {
        if (schoolWeekConfig && configKey) {
            const currentValue = schoolWeekConfig[configKey]?.toString() || '';
            setValue(currentValue);
            setInitialValue(currentValue);
        }
    }, [schoolWeekConfig, configKey]);

    useEffect(() => {
        if (value !== initialValue && token && schoolWeekConfig && configKey) {
            const updatedConfig = {
                ...schoolWeekConfig,
                [configKey]: Number(value)
            };
            dispatch(updateConfigRequest({ token, updatedConfig }));
        }
    }, [value, initialValue, token, configKey, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const wholeNumberPattern = /^-?\d*$/;

        if (!wholeNumberPattern.test(newValue)) return;

        const numericValue = parseFloat(newValue);
        if (!isNaN(numericValue)) {
            setValue(
                Math.min(
                    Math.max(numericValue, min || numericValue),
                    max || numericValue
                ).toString()
            );
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
                />
            )}
            <div className={styles.panel}>
                {title}
                {rightSideControl === 'button' ? (
                    <Button
                        className="rightSideControl"
                        onClick={handleOpenPopup}
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
                        title={`Only whole numbers between ${min}-${max} are allowed`}
                    />
                )}
            </div>
        </>
    );
};

export default Panel;
