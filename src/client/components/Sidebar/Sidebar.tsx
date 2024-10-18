import { useDispatch } from 'react-redux';
import Button from '../Button/Button';
import styles from './Sidebar.module.css';
import { logOut } from '../../store/slices/authSlice';

const Sidebar: React.FC = () => {
    const dispatch = useDispatch();
    return (
        <div className={styles.sidebar}>
            <div className={styles.topIconButtons}>
                <Button type="button" className="sidebar">
                    <img
                        src="src/client/assets/classSyncLogo.svg"
                        className={styles.classSyncLogo}
                        width="64"
                        height="64"
                    />
                </Button>
                <Button type="button" className="sidebar">
                    <img src="src\client\assets\homeIcon.svg" />
                </Button>
                <Button type="button" className="sidebar">
                    <img src="src\client\assets\createScheduleIcon.svg" />
                </Button>
                <Button type="button" className="sidebar">
                    <img src="src\client\assets\settingsIcon.svg" />
                </Button>
            </div>
            <div className={styles.bottomIconButtons}>
                <Button
                    type="button"
                    className="sidebar"
                    onClick={() => dispatch(logOut())}
                >
                    <img src="src\client\assets\profileIcon.svg" />
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
