import clsx from 'clsx';
import React, { useEffect } from 'react';
import closeIcon from '../../assets/closeIcon.svg';
import Button from '../Button/Button';
import styles from './PopUpCard.module.css';

interface PopUpCardProps {
    title: string;
    onCancel: () => void;
    children: React.ReactNode;
    className?: string;
}

export const PopUpCard: React.FC<PopUpCardProps> = ({
    title,
    onCancel,
    children,
    className = ''
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

    return (
        <div className={styles.overlay} onClick={handleBackgroundClick}>
            <div
                className={clsx(
                    styles.popupCard,
                    className.split(' ').map((cls) => styles[cls])
                )}
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
                {children}
            </div>
        </div>
    );
};
