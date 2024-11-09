import axios from 'axios';
import { IUser } from '../../common/types/IUser.js';

export const getUsersApi = (token: string) => {
    return axios.get<IUser[]>(`http://localhost:3000/users`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getUserApi = (email: string) => {
    return axios.get<IUser>(`http://localhost:3000/user/${email}`);
};
