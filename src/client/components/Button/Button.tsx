import React from 'react';
import styles from './button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    size = '',
    type,
    children,
    onClick,
    className = '',
    loading = false,
    style = {}
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${styles.btn} ${styles[size]} ${styles[className]}`}
            style={style}
            disabled={loading}
        >
            {children}
            {loading && <span className={styles.spinner}></span>}
        </button>
    );
};

export default Button;
