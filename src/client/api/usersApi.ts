import axios from 'axios';
import { IUser } from '../../common/types/IUser';

export const fetchUsersApi = () => {
    return axios.get<IUser[]>(`http://localhost:3000/users`);
};
