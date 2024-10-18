import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
    className = '',
    handleChange,
    ...props
}) => {
    return (
        <input
            className={`${styles.input} ${styles[className]}`}
            onChange={handleChange}
            {...props}
        />
    );
};

export default Input;
