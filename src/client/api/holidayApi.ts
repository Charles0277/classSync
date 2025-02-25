import { IHoliday } from '@/common/types/IHoliday';
import axios from 'axios';

export const getAllHolidaysApi = (token: string) => {
    return axios.get<IHoliday[]>(`http://localhost:3000/holidays`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const deleteHolidayApi = (id: string, token: string) => {
    return axios.delete<IHoliday>(
        `http://localhost:3000/delete-holiday/${id}`,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};

export const updateHolidayApi = (id: string, formData: any, token: string) => {
    return axios.put<IHoliday>(
        `http://localhost:3000/update-holiday/${id}`,
        formData,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};

export const createHolidayApi = (formData: any, token: string) => {
    return axios.post<IHoliday>(
        `http://localhost:3000/create-holiday`,
        formData,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};
