import { useAuth0 } from '@auth0/auth0-react';
import Button from '../Button/Button';
import styles from './Sidebar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { checkOrCreateUserRequest } from '../../store/slices/userSlice';
import { RootState } from '../../store/store';
// import { getToken } from '../../utils/utilFunctions';

const Sidebar: React.FC = () => {
    const { logout, user, getAccessTokenSilently } = useAuth0();
    console.log('🚀 ~ user:', user);
    const [token, setToken] = useState<string>();
    const { currentUser } = useSelector((state: RootState) => state.users);
    console.log('🚀 ~ currentUser:', currentUser);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchToken = async () => {
            const accessToken = await getAccessTokenSilently();
            setToken(accessToken);
        };

        fetchToken();
    }, [getAccessTokenSilently]);

    useEffect(() => {
        if (user && token) {
            dispatch(
                checkOrCreateUserRequest({
                    token: token,
                    email: user.email,
                    auth0Id: user.sub
                })
            );
        }
    }, [user, token]);

    // useEffect(() => {
    //     if (user && currentUser) {
    //         if(user.ro)
    //     }
    // }, [user, token]);

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
