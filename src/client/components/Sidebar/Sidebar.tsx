import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import classSyncLogo from '../../assets/classSyncLogo.svg';
import feedbackIcon from '../../assets/feedbackIcon.svg';
import homeIcon from '../../assets/homeIcon.svg';
import profileIcon from '../../assets/profileIcon.svg';
import settingsIcon from '../../assets/settingsIcon.svg';
import { logOut } from '../../store/slices/authSlice';
import { RESET_STATE } from '../../store/rootReducer';
import { RootState } from '../../store/store';
import Button from '../Button/Button';
import AddEditUserCard from '../ManageUsers/AddEditUserCard/AddEditUserCard';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isEditCardVisible, setIsEditCardVisible] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node)
            ) {
                setIsPopupVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsPopupVisible(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isPopupVisible]);

    const handleProfileClick = () => {
        setIsPopupVisible((prev) => !prev);
    };

    const handleUserSettings = () => {
        setIsEditCardVisible(true);
        setIsPopupVisible(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch({ type: RESET_STATE });
        //For some reason, even after resetting the state, isLoading is true even after the token is removed beforehand so logOut is called to set isLoading to false
        dispatch(logOut());
        setIsPopupVisible(false);
        navigate('/');
    };

    return (
        <>
            {isEditCardVisible && (
                <AddEditUserCard
                    user={user}
                    onSave={() => setIsEditCardVisible(false)}
                    onCancel={() => setIsEditCardVisible(false)}
                    mode="edit"
                />
            )}
            <div ref={sidebarRef} className={styles.sidebar}>
                <div className={styles.topIconButtons}>
                    <img
                        src={classSyncLogo}
                        width="58"
                        height="58"
                        alt="Logo"
                    />
                    <Button
                        type="button"
                        className={
                            location.pathname === '/'
                                ? 'sidebar activeSidebar'
                                : 'sidebar'
                        }
                        onClick={() => navigate('/')}
                    >
                        <img src={homeIcon} alt="Home" />
                    </Button>
                    <Button
                        type="button"
                        className={
                            location.pathname === '/feedback'
                                ? 'sidebar activeSidebar'
                                : 'sidebar'
                        }
                        onClick={() => navigate('/feedback')}
                    >
                        <img src={feedbackIcon} alt="Schedule" />
                    </Button>
                    {user && user.role === 'admin' && (
                        <Button
                            type="button"
                            className={
                                location.pathname === '/configurations'
                                    ? 'sidebar activeSidebar'
                                    : 'sidebar'
                            }
                            onClick={() => navigate('/configurations')}
                        >
                            <img src={settingsIcon} alt="Settings" />
                        </Button>
                    )}
                </div>
                <div className={styles.bottomIconButtons}>
                    <Button
                        type="button"
                        className="sidebar"
                        onClick={handleProfileClick}
                    >
                        <img src={profileIcon} alt="Profile" />
                    </Button>
                    {isPopupVisible && (
                        <div ref={popupRef} className={styles.popup}>
                            <ul>
                                <li onClick={handleUserSettings}>Settings</li>
                                <li onClick={handleLogout}>Logout</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
