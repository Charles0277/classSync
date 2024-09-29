import React from 'react';
import styles from './Welcome.module.css';

const LeftColumn: React.FC = () => {
    return (
        <section className={styles.leftColumn}>
            <div className={styles.blueSection}>
                <img
                    loading="lazy"
                    src="src\client\assets\classSyncLogo_scalable.svg"
                    className={styles.logo}
                    alt="Scheduler logo"
                />
                <div className={styles.textContainer}>
                    <h1 className={styles.title}>
                        Welcome to Scheduler <br />
                        Simplifying Academic Scheduling for Everyone.
                    </h1>
                    <p className={styles.description}>
                        Streamline your scheduling process with our automated
                        system, designed to minimize conflicts and maximize
                        efficiency.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LeftColumn;
