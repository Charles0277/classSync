import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { IRoom } from '../../../common/types/IRoom';
import addIcon from '../../assets/addIcon.svg';
import {
    deleteRoomRequest,
    fetchAllRoomsRequest,
    resetRoomAdded,
    resetRoomDeleted,
    resetRoomUpdated
} from '../../store/slices/roomSlice';
import { RootState } from '../../store/store.js';
import Button from '../Button/Button';
import styles from './ManageRooms.module.css';

interface ManageRoomsProps {
    onAddEditRoom: (room?: IRoom) => void;
}

const ManageRooms: React.FC<ManageRoomsProps> = ({ onAddEditRoom }) => {
    const { token } = useSelector((state: RootState) => state.auth);
    const { rooms, loading, isRoomAdded, isRoomDeleted, isRoomUpdated, error } =
        useSelector((state: RootState) => state.room);

    const [filter, setFilter] = useState<
        | 'all'
        | 'lectureTheatre'
        | 'laboratory'
        | 'classroom'
        | 'office'
        | 'computerCluster'
    >('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [roomToDelete, setRoomToDelete] = useState<IRoom | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            dispatch(fetchAllRoomsRequest({ token }));
        }
    }, [token]);

    useEffect(() => {
        if (isRoomAdded) {
            toast.success('Room added successfully! 🆕');
            dispatch(resetRoomAdded());
        }
        if (isRoomUpdated) {
            toast.success('Room updated successfully! ✏️');
            dispatch(resetRoomUpdated());
        }
        if (isRoomDeleted) {
            toast.success('Room deleted successfully! 🗑️');
            dispatch(resetRoomDeleted());
        }
        if (error) {
            toast.error(
                `Room ${isRoomAdded ? 'submission' : isRoomUpdated ? 'update' : 'deletion'} failed: ${error} ⚠️`
            );
        }
    }, [isRoomAdded, isRoomUpdated, isRoomDeleted, error]);

    const handleFilterChange = (
        newFilter:
            | 'all'
            | 'lectureTheatre'
            | 'laboratory'
            | 'classroom'
            | 'office'
            | 'computerCluster'
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
                <div className={styles.filterButtons}>
                    <Button
                        type="button"
                        onClick={() => handleFilterChange('all')}
                        className={filter === 'all' ? 'selectedButton' : ''}
                    >
                        All
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleFilterChange('lectureTheatre')}
                        className={
                            filter === 'lectureTheatre' ? 'selectedButton' : ''
                        }
                    >
                        Lecture Theatre
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleFilterChange('classroom')}
                        className={
                            filter === 'classroom' ? 'selectedButton' : ''
                        }
                    >
                        Class Room
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleFilterChange('laboratory')}
                        className={
                            filter === 'laboratory' ? 'selectedButton' : ''
                        }
                    >
                        Laboratory
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleFilterChange('office')}
                        className={filter === 'office' ? 'selectedButton' : ''}
                    >
                        Office
                    </Button>
                    <Button
                        type="button"
                        onClick={() => handleFilterChange('computerCluster')}
                        className={
                            filter === 'computerCluster' ? 'selectedButton' : ''
                        }
                    >
                        Computer Cluster
                    </Button>
                </div>
                <Button type="button" onClick={() => onAddEditRoom()}>
                    <img src={addIcon} alt="Add" /> Add Room
                </Button>
            </div>

            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search by room name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

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
                ) : loading ? (
                    <div className={styles.noResults}>Loading rooms...</div>
                ) : (
                    <div className={styles.noResults}>No rooms found</div>
                )}
            </div>
        </div>
    );
};

export default ManageRooms;
