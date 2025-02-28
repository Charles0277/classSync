import axios, { AxiosResponse } from 'axios';
import { IUser } from '../../common/types/IUser';

export const signUpApi = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string,
    yearOfStudy: number,
    course: string,
    courseUnits: string
): Promise<AxiosResponse<IUser>> => {
    const requestBody = {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        yearOfStudy,
        course,
        courseUnits
    };
    return axios.post<IUser>('http://localhost:3000/auth/signup', requestBody);
};

export const logInApi = async (
    email: string,
    password: string
): Promise<AxiosResponse<IUser>> => {
    const requestBody = { email, password };
    return axios.post<IUser>('http://localhost:3000/auth/login', requestBody);
};
