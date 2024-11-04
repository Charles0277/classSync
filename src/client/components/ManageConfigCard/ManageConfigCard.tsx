import React, { useEffect } from 'react';
import styles from './ManageConfigCard.module.css';
import Panel from '../Panels/Panel';
import closeIcon from '../../assets/closeIcon.svg';
import Button from '../Button/Button';

interface ManageCardConfigProps {
    title: string;
    onCancel: () => void;
}

interface PanelConfig {
    title: string;
    rightSideControl: 'input' | 'button';
    min?: number;
    max?: number;
}

const ManageCardConfig: React.FC<ManageCardConfigProps> = ({
    title,
    onCancel
}) => {
    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Close the popup if clicking outside the popup card
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onCancel]);

    const panelConfigs: PanelConfig[] = [
        { title: 'Days per week', rightSideControl: 'input', min: 3, max: 7 },
        { title: 'Hours per day', rightSideControl: 'input', min: 5, max: 10 },
        { title: 'Start hour', rightSideControl: 'input', min: 6, max: 13 },
        { title: 'End hour', rightSideControl: 'input', min: 10, max: 19 }
    ];

    return (
        <div className={styles.overlay} onClick={handleBackgroundClick}>
            <div
                className={styles.popupCard}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.closeIcon}>
                    <Button
                        type="button"
                        onClick={() => {
                            onCancel();
                        }}
                    >
                        <img src={closeIcon} />
                    </Button>
                </div>
                <h2 className={styles.popupTitle}>{title}</h2>
                {title === 'Manage School Week' && (
                    <div className={styles.schoolWeek}>
                        {panelConfigs.map((config) => (
                            <Panel
                                key={config.title}
                                title={config.title}
                                rightSideControl={config.rightSideControl}
                                min={config.min}
                                max={config.max}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCardConfig;
