import axios from 'axios';
import { IRoom } from '../../common/types/IRoom.js';

export const fetchRoomsApi = (token: string) => {
    return axios.get<IRoom[]>(`http://localhost:3000/rooms`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
