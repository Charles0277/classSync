import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, title, className = '' }) => {
    return (
        <>
            <div className={styles.card}>
                <div className={styles.title}>{title}</div>
                <div className={`${styles[className]}`}>{children}</div>
            </div>
        </>
    );
};

export default Card;
