import { useAuth0 } from '@auth0/auth0-react';
import Button from '../Button/Button';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
    const { logout } = useAuth0();

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
                <Button
                    color="transparent"
                    onClick={() =>
                        logout({
                            logoutParams: { returnTo: 'http://localhost:3000/' }
                        })
                    }
                >
                    <img src="src\client\assets\vite.svg" />
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
