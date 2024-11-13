import { useEffect } from 'react';
import styles from './ManageRooms.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store.js';
import { fetchAllRoomsRequest } from '../../store/slices/roomSlice.js';

const ManageRooms = () => {
    const { token } = useSelector((state: RootState) => state.auth);
    const { rooms } = useSelector((state: RootState) => state.room);
    console.log('🚀 ~ ManageSchoolWeek ~ rooms:', rooms);

    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            dispatch(fetchAllRoomsRequest({ token }));
        }
    }, [token]);

    return (
        <>
            {rooms &&
                rooms.map((room, index) => (
                    <div
                        key={room.name}
                        className={`${styles.roomContainer} ${
                            index === rooms.length - 1 ? styles.lastRoom : ''
                        }`}
                    >
                        {room.name}
                    </div>
                ))}
        </>
    );
};

export default ManageRooms;
