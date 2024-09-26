import React from 'react';
import styles from './Input.module.css';

interface inputProps {
    type: string;
    id: string;
    name: string;
    placeholder?: string;
    value?: string;
    onClick?: React.MouseEventHandler;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<inputProps> = ({
    type,
    id,
    name,
    placeholder,
    value,
    onClick,
    onChange
}) => {
    return (
        <>
            <input
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                className={styles.input}
                value={value}
                onClick={onClick}
                onChange={onChange}
            />
        </>
    );
};

export default Input;
