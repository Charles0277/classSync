import axios from 'axios';
import { IRoom } from '../../common/types/IRoom.js';

export const fetchRoomsApi = (token: string) => {
    return axios.get<IRoom[]>(`http://localhost:3000/rooms`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const deleteRoomApi = (id: string, token: string) => {
    return axios.delete<IRoom>(`http://localhost:3000/delete-room/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateRoomApi = (id: string, formData: any, token: string) => {
    return axios.put<IRoom>(
        `http://localhost:3000/update-room/${id}`,
        formData,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};

export const createRoomApi = (formData: any, token: string) => {
    return axios.post<IRoom>(`http://localhost:3000/create-room`, formData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
