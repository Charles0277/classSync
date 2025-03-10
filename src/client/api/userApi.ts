import axios from 'axios';
import { IFriend, IUser } from '../../common/types/IUser.js';

export const getAllUsersApi = (token: string) => {
    return axios.get<IUser[]>(`http://localhost:3000/all-users`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getUsersApi = (token: string, userIds: string[]) => {
    return axios.get<IUser[]>(`http://localhost:3000/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: userIds || []
    });
};

export const getAllTeachersApi = (token: string) => {
    return axios.get<IUser[]>(`http://localhost:3000/all-teachers`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getAllStudentsApi = (token: string) => {
    return axios.get<IUser[]>(`http://localhost:3000/all-students`, {
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

export const sendFriendRequestApi = (email: string, token: string) => {
    return axios.post<IFriend>(
        `http://localhost:3000/send-friend-request/${email}`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};

export const removeFriendApi = (friendId: string, token: string) => {
    return axios.delete<IFriend>(
        `http://localhost:3000/remove-friend/${friendId}`,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};

export const acceptFriendRequestApi = (friendId: string, token: string) => {
    return axios.post<IFriend>(
        `http://localhost:3000/accept-friend-request`,
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const declineFriendRequestApi = (friendId: string, token: string) => {
    return axios.post<IFriend>(
        `http://localhost:3000/decline-friend-request`,
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};
