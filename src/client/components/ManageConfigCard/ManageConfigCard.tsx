// components/Popup.js
import React from 'react';
import styles from './ManageConfigCard.module.css';
import Panel from '../Panels/Panel';

interface ManageCardConfigProps {
    title: string;
    onCancel: () => void;
    onConfirm: () => void;
}

const ManageCardConfig: React.FC<ManageCardConfigProps> = ({
    title,
    onCancel,
    onConfirm
}) => {
    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // If the click is on the overlay and not the card, trigger onCancel
        if ((e.target as HTMLDivElement).className.includes(styles.overlay)) {
            onCancel();
        }
    };

    const renderSchoolWeek = () => {
        return (
            <div className={styles.schoolWeek}>
                <Panel
                    title="Days per week"
                    rightSideControl="input"
                    min={3}
                    max={7}
                ></Panel>
                <Panel
                    title="Hours per day"
                    rightSideControl="input"
                    min={5}
                    max={10}
                ></Panel>
            </div>
        );
    };

    return (
        <div className={styles.overlay} onClick={handleBackgroundClick}>
            <div
                className={styles.popupCard}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className={styles.popupTitle}>{title}</h2>
                {title === 'Manage School Week' ? renderSchoolWeek() : null}
            </div>
        </div>
    );
};

export default ManageCardConfig;
