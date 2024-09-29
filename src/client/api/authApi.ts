import axios, { AxiosResponse } from 'axios';
import { IUser } from '../../common/types/IUser';

export const logInApi = async (
    email: string,
    password: string
): Promise<AxiosResponse<IUser>> => {
    const requestBody = { email, password };
    return axios.post<IUser>('http://localhost:3000/auth/login', requestBody);
};
