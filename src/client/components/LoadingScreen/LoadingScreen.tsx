import React, { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

export const LoadingScreen: React.FC = () => {
    return (
        <div className={styles.loadingScreen}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading...</p>
        </div>
    );
};
