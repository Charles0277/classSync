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
    required?: boolean;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    title?: string;
    style?: React.CSSProperties;
}

const Input: React.FC<inputProps> = ({
    type,
    id,
    name,
    placeholder,
    value,
    onClick,
    onChange,
    required,
    pattern,
    minLength,
    maxLength,
    title,
    style
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
                required={required}
                pattern={pattern}
                minLength={minLength}
                maxLength={maxLength}
                title={title}
                style={style}
            />
        </>
    );
};

export default Input;
