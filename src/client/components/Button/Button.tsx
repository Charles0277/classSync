import React from 'react';
import styles from './button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
    size = '',
    type,
    children,
    onClick,
    className = ''
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${styles.btn} ${styles[size]} ${styles[className]}`}
        >
            {children}
        </button>
    );
};

export default Button;
