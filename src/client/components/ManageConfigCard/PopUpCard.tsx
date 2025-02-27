import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
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
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => {
            setIsVisible(true);
        });
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onCancel, 200);
    };

    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onCancel]);

    return (
        <div
            className={clsx(styles.overlay, isVisible && styles.overlayVisible)}
            onClick={handleBackgroundClick}
        >
            <div
                className={clsx(
                    styles.popupCard,
                    isVisible && styles.popupCardVisible,
                    className.split(' ').map((cls) => styles[cls])
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.closeIcon}>
                    <Button type="button" onClick={handleClose}>
                        <img src={closeIcon} />
                    </Button>
                </div>
                <h2 className={styles.popupTitle}>{title}</h2>
                {children}
            </div>
        </div>
    );
};
