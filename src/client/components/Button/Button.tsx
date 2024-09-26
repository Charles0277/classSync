import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import styles from './button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
    size,
    type,
    children,
    onClick,
    color
}) => {
    const className = size
        ? `${styles.button} ${styles[size]}`
        : `${styles.button}`;
    return (
        <button
            type={type}
            onClick={onClick}
            className={className}
            style={{ backgroundColor: color }}
        >
            {children}
        </button>
    );
};

export default Button;
