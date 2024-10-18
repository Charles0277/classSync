import React, { useState } from 'react';
import Button from '../Button/Button';
import Input from '../Input/Input';
import styles from './Panel.module.css';

interface CardProps {
    title: string;
    rightSideControl?: 'button' | 'input';
    min?: number;
    max?: number;
}

const Panel: React.FC<CardProps> = ({ title, rightSideControl, min, max }) => {
    const [value, setValue] = useState('');

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
        <div className={styles.panel}>
            {title}
            {rightSideControl === 'button' ? (
                <Button className="rightSideControl">Manage</Button>
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
    );
};

export default Panel;
