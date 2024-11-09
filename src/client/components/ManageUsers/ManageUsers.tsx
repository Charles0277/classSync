import { useEffect } from 'react';
import styles from './ManageUsers.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store.js';
import { getUsersRequest } from '../../store/slices/userSlice';

const ManageRooms = () => {
    const { token } = useSelector((state: RootState) => state.auth);
    const { users } = useSelector((state: RootState) => state.user);

    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            dispatch(getUsersRequest({ token }));
        }
    }, [token]);

    return (
        <>
            {users &&
                users.map((user, index) => (
                    <div
                        key={user.email}
                        className={`${styles.userContainer} ${
                            index === users.length - 1 ? styles.lastUser : ''
                        }`}
                    >
                        {user.firstName} {user.lastName}
                    </div>
                ))}
        </>
    );
};

export default ManageRooms;
