import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IUser } from '../../../common/types/IUser';
import addIcon from '../../assets/addIcon.svg';
import {
    deleteUserRequest,
    fetchAllUsersRequest
} from '../../store/slices/userSlice';
import { RootState } from '../../store/store.js';
import Button from '../Button/Button';
import styles from './ManageUsers.module.css';

interface ManageUsersProps {
    onAddUser: () => void;
    onEditUser: (user: IUser) => void;
}

const ManageUsers: React.FC<ManageUsersProps> = ({ onEditUser, onAddUser }) => {
    const { token } = useSelector((state: RootState) => state.auth);
    const { users, loading } = useSelector((state: RootState) => state.user);

    const [filter, setFilter] = useState<'all' | 'student' | 'teacher'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            dispatch(fetchAllUsersRequest({ token }));
        }
    }, [token]);

    const handleFilterChange = (newFilter: 'all' | 'student' | 'teacher') => {
        setFilter(newFilter);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const onDeleteUser = (user: IUser) => {
        if (token) {
            dispatch(deleteUserRequest({ id: user._id, token }));
            setUserToDelete(null);
        }
    };

    const filteredUsers = users?.filter((user) => {
        const matchesFilter = filter === 'all' || user.role === filter;
        const matchesSearch =
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div>
            <div className={styles.filterAndAddContainer}>
                <div className={styles.filterButtons}>
                    <Button
                        type="button"
                        onClick={() => handleFilterChange('all')}
                    >
                        All
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleFilterChange('student')}
                    >
                        Students
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleFilterChange('teacher')}
                    >
                        Teachers
                    </Button>
                </div>
                <div>
                    <Button type="button" onClick={() => onAddUser()}>
                        <img src={addIcon} alt="Edit" /> Add User
                    </Button>
                </div>
            </div>

            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search by first or last name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className={styles.userList}>
                {filteredUsers && filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                        <div
                            key={user.email}
                            className={`${styles.userContainer} ${
                                index === users.length - 1
                                    ? styles.lastUser
                                    : ''
                            }`}
                        >
                            {user.firstName} {user.lastName}
                            <div className={styles.rightSideControl}>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        onEditUser(user);
                                    }}
                                >
                                    <img
                                        src="src/client/assets/editIcon.svg"
                                        alt="Edit"
                                    />
                                </Button>
                                {userToDelete?.email === user.email ? (
                                    <div
                                        className={
                                            styles.confirmDeleteContainer
                                        }
                                    >
                                        <span>Confirm delete?</span>
                                        <div
                                            className={
                                                styles.confirmDeleteButtonGroup
                                            }
                                        >
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    onDeleteUser(user)
                                                }
                                            >
                                                Yes
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    setUserToDelete(null)
                                                }
                                            >
                                                No
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() => setUserToDelete(user)}
                                    >
                                        <img
                                            src="src/client/assets/trashIcon.svg"
                                            alt="Delete"
                                        />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                ) : loading ? (
                    <div className={styles.noResults}>Loading users...</div>
                ) : (
                    <div className={styles.noResults}>No users found</div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
