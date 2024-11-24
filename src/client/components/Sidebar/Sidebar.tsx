import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';
import Button from '../Button/Button';
import styles from './Sidebar.module.css';
import AddEditUserCard from '../ManageUsers/AddEditUserCard/AddEditUserCard';

const Sidebar: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

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
        dispatch(logOut());
        setIsPopupVisible(false);
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
                    <Button
                        type="button"
                        className="sidebar"
                        onClick={() => navigate('/')}
                    >
                        <img
                            src="src/client/assets/classSyncLogo.svg"
                            className={styles.classSyncLogo}
                            width="50"
                            height="50"
                            alt="Logo"
                        />
                    </Button>
                    <Button
                        type="button"
                        className="sidebar"
                        onClick={() => navigate('/')}
                    >
                        <img src="src/client/assets/homeIcon.svg" alt="Home" />
                    </Button>
                    <Button type="button" className="sidebar">
                        <img
                            src="src/client/assets/createScheduleIcon.svg"
                            alt="Schedule"
                        />
                    </Button>
                    {user && user.role === 'admin' && (
                        <Button
                            type="button"
                            className="sidebar"
                            onClick={() => navigate('/configurations')}
                        >
                            <img
                                src="src/client/assets/settingsIcon.svg"
                                alt="Settings"
                            />
                        </Button>
                    )}
                </div>
                <div className={styles.bottomIconButtons}>
                    <Button
                        type="button"
                        className="sidebar"
                        onClick={handleProfileClick}
                    >
                        <img
                            src="src/client/assets/profileIcon.svg"
                            alt="Profile"
                        />
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
