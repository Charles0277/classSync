import React from 'react';
import styles from './NotFound.module.css';
import notFoundSchedule from '../../assets/scheduleNotFound.svg';

interface NotFoundProps {
    title: string;
    description: string;
}

export const NotFound: React.FC<NotFoundProps> = ({ title, description }) => {
    return (
        <div className={styles.notFound}>
            <img src={notFoundSchedule} />
            <div className={styles.title}>{title}</div>
            <div className={styles.description}>{description}</div>
        </div>
    );
};
