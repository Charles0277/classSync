import { IFeedback } from '@/common/types/IFeedback.js';
import axios from 'axios';

export const getAllFeedbackApi = (token: string) => {
    return axios.get<IFeedback[]>(`http://localhost:3000/all-feedback`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getUserFeedbackApi = (token: string, userId: string) => {
    return axios.get<IFeedback[]>(
        `http://localhost:3000/user-feedback/${userId}`,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};

export const deleteFeedbackApi = (id: string, token: string) => {
    return axios.delete<IFeedback>(
        `http://localhost:3000/delete-feedback/${id}`,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};

export const updateFeedbackApi = (id: string, formData: any, token: string) => {
    return axios.put<IFeedback>(
        `http://localhost:3000/update-feedback/${id}`,
        formData,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};

export const createFeedbackApi = (formData: any, token: string) => {
    return axios.post<IFeedback>(
        `http://localhost:3000/create-feedback`,
        formData,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};
