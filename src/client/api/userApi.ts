import axios from 'axios';
import { IUser } from '../../common/types/IUser.js';

export const getUsersApi = (token: string) => {
    return axios.get<IUser[]>(`http://localhost:3000/users`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getTeachersApi = (token: string) => {
    return axios.get<IUser[]>(`http://localhost:3000/teachers`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getUserApi = (email: string) => {
    return axios.get<IUser>(`http://localhost:3000/user/${email}`);
};

export const updateUserApi = (id: string, formData: any, token: string) => {
    return axios.put<IUser>(
        `http://localhost:3000/update-user/${id}`,
        formData,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};

export const deleteUserApi = (id: string, token: string) => {
    return axios.delete<IUser>(`http://localhost:3000/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
