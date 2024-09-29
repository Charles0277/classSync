import Button from '../Button/Button';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
    return (
        <div className={styles.sidebar}>
            <div className={styles.topIconButtons}>
                <Button color="transparent">
                    <img
                        src="src\client\assets\classSyncLogo_scalable.svg"
                        className={styles.classSyncLogo}
                    />
                </Button>
                <Button color="transparent">
                    <img src="src\client\assets\vite.svg" />
                </Button>
                <Button color="transparent">
                    <img src="src\client\assets\vite.svg" />
                </Button>
            </div>
            <div className={styles.bottomIconButtons}>
                <Button color="transparent">
                    <img src="src\client\assets\vite.svg" />
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
