import React from 'react';
import LeftColumn from './LeftColumn';
import RightColumn from './RightColumn';
import styles from './Welcome.module.css';

const Welcome: React.FC = () => {
    return (
        <div className={styles.content}>
            <LeftColumn />
            <RightColumn />
        </div>
    );
};

export default Welcome;
