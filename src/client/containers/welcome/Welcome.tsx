import React from 'react';
import styles from './Welcome.module.css';
import LeftColumn from './LeftColumn';
import RightColumn from './RightColumn';

const Welcome: React.FC = () => {
    return (
        <div className={styles.content}>
            <LeftColumn />
            <RightColumn />
        </div>
    );
};

export default Welcome;
