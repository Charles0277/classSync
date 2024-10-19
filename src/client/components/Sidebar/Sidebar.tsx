import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';
import Button from '../Button/Button';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <div className={styles.sidebar}>
            <div className={styles.topIconButtons}>
                <Button
                    type="button"
                    className="sidebar"
                    onClick={() => {
                        navigate('/');
                    }}
                >
                    <img
                        src="src/client/assets/classSyncLogo.svg"
                        className={styles.classSyncLogo}
                        width="50"
                        height="50"
                    />
                </Button>
                <Button
                    type="button"
                    className="sidebar"
                    onClick={() => {
                        navigate('/');
                    }}
                >
                    <img src="src\client\assets\homeIcon.svg" />
                </Button>
                <Button type="button" className="sidebar">
                    <img src="src\client\assets\createScheduleIcon.svg" />
                </Button>
                {user && user.role === 'admin' && (
                    <Button
                        type="button"
                        className="sidebar"
                        onClick={() => navigate('/configurations')}
                    >
                        <img src="src\client\assets\settingsIcon.svg" />
                    </Button>
                )}
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
