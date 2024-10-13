import axios from 'axios';
import { IUser } from '../../common/types/IUser';

export const getUsersApi = () => {
    return axios.get<IUser[]>(`http://localhost:3000/users`);
};

export const getUserApi = (email: string) => {
    return axios.get<IUser[]>(`http://localhost:3000/user/${email}`);
};
