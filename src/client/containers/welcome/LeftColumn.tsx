import React from 'react';
import styles from './Welcome.module.css';

const LeftColumn: React.FC = () => {
    return (
        <section className={styles.leftColumn}>
            <div className={styles.blueSection}>
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/b4b8315c3d6487647269b270f7f0a787f582a6f5010c540543d943a6444f7dac?placeholderIfAbsent=true&apiKey=c94df9336f314d7a8ada5b51d69da4b6"
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
