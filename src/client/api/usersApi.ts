import axios from 'axios';
import { IUser } from '../../common/types/IUser';
import { useAuth0 } from '@auth0/auth0-react';

export const fetchUsersApi = (token: string) => {
    return axios.get<IUser[]>(`http://localhost:3000/users`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const checkOrCreateUserApi = (
    token: string,
    email: string,
    auth0Id: string
) => {
    const requestBody = { email, auth0Id };
    return axios.post<IUser>(
        `http://localhost:3000/auth/check-or-create-user`,
        requestBody,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};
