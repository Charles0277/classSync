import Button from '../Button/Button';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
    return (
        <div className={styles.sidebar}>
            <div className={styles.topIconButton}>
                <Button color="transparent">
                    <img src="../../assets/vite.svg" />
                </Button>
                <Button color="transparent">
                    <img src="../../assets/vite.svg" />
                </Button>
                <Button color="transparent">
                    <img src="../../assets/vite.svg" />
                </Button>
            </div>
            <div className={styles.bottomIconButtons}>
                <Button color="transparent">
                    <img src="../../assets/vite.svg" />
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
