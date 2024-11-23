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

export const updateUserApi = (formData: any, token: string) => {
    const { email } = formData;
    return axios.put<IUser>(
        `http://localhost:3000/update-user/${email}`,
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
