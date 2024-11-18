import { useEffect, useState } from 'react';
import styles from './ManageUsers.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store.js';
import {
    deleteUserRequest,
    getUsersRequest
} from '../../store/slices/userSlice';
import Button from '../Button/Button';
import { IUser } from '../../../common/types/IUser';
import addIcon from '../../assets/addIcon.svg';

interface ManageUsersProps {
    onAddUser: () => void;
    onEditUser: (user: IUser) => void;
}

const ManageUsers: React.FC<ManageUsersProps> = ({ onEditUser, onAddUser }) => {
    const { token } = useSelector((state: RootState) => state.auth);
    const { users } = useSelector((state: RootState) => state.user);

    const [filter, setFilter] = useState<'all' | 'student' | 'teacher'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [userToDelete, setUserToDelete] = useState<IUser | null>(null); // Track user for confirmation
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            dispatch(getUsersRequest({ token }));
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
                {/* Filter Buttons */}
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

            {/* Search Bar */}
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search by first or last name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            {/* User List */}
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
                                    // Confirmation UI
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
                                                } // Cancel confirmation
                                            >
                                                No
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    // Trash icon to initiate confirmation
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
                ) : (
                    <div className={styles.noResults}>No users found</div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
