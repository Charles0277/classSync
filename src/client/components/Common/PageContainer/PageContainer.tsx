import React from 'react';
import styles from './PageContainer.module.css';

interface PageContainerProps {
    children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
    return <div className={styles.pageContainer}>{children}</div>;
};

export default PageContainer;
