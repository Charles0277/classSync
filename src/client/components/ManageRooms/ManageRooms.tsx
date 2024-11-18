import { useEffect, useState } from 'react';
import styles from './ManageRooms.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store.js';
import {
    deleteRoomRequest,
    fetchAllRoomsRequest
} from '../../store/slices/roomSlice';
import Button from '../Button/Button';
import { IRoom } from '../../../common/types/IRoom';
import addIcon from '../../assets/addIcon.svg';

interface ManageRoomsProps {
    onAddEditRoom: (room?: IRoom) => void;
}

const ManageRooms: React.FC<ManageRoomsProps> = ({ onAddEditRoom }) => {
    const { token } = useSelector((state: RootState) => state.auth);
    const { rooms } = useSelector((state: RootState) => state.room);

    const [filter, setFilter] = useState<
        'all' | 'Lecture Theatre' | 'Laboratory' | 'Office' | 'Computer Cluster'
    >('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [roomToDelete, setRoomToDelete] = useState<IRoom | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            dispatch(fetchAllRoomsRequest({ token }));
        }
    }, [token]);

    const handleFilterChange = (
        newFilter:
            | 'all'
            | 'Lecture Theatre'
            | 'Laboratory'
            | 'Office'
            | 'Computer Cluster'
    ) => {
        setFilter(newFilter);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const onDeleteRoom = (room: IRoom) => {
        if (token) {
            dispatch(deleteRoomRequest({ id: room._id, token }));
            setRoomToDelete(null);
        }
    };

    const filteredRooms = rooms?.filter((room) => {
        const matchesFilter = filter === 'all' || room.type === filter;
        const matchesSearch = room.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
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
                        onClick={() => handleFilterChange('Lecture Theatre')}
                    >
                        Lecture Theatre
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleFilterChange('Laboratory')}
                    >
                        Laboratory
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleFilterChange('Office')}
                    >
                        Office
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleFilterChange('Computer Cluster')}
                    >
                        Computer Cluster
                    </Button>
                </div>
                <Button type="button" onClick={() => onAddEditRoom()}>
                    <img src={addIcon} alt="Add" /> Add Room
                </Button>
            </div>

            {/* Search Bar */}
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search by room name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Room List */}
            <div className={styles.roomList}>
                {filteredRooms && filteredRooms.length > 0 ? (
                    filteredRooms.map((room, index) => (
                        <div
                            key={room.name}
                            className={`${styles.roomContainer} ${
                                index === filteredRooms.length - 1
                                    ? styles.lastRoom
                                    : ''
                            }`}
                        >
                            {room.name}
                            <div className={styles.rightSideControl}>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        onAddEditRoom(room);
                                    }}
                                >
                                    <img
                                        src="src/client/assets/editIcon.svg"
                                        alt="Edit"
                                    />
                                </Button>
                                {roomToDelete?.name === room.name ? (
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
                                                    onDeleteRoom(room)
                                                }
                                            >
                                                Yes
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    setRoomToDelete(null)
                                                }
                                            >
                                                No
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    // Trash icon to initiate confirmation
                                    <Button
                                        type="button"
                                        onClick={() => setRoomToDelete(room)}
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
                    <div className={styles.noResults}>No rooms found</div>
                )}
            </div>
        </div>
    );
};

export default ManageRooms;
