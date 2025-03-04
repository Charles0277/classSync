import { IClass } from '@/common/types/IClass';
import axios from 'axios';

export const getClassApi = (token: string, id: string) => {
    return axios.get<IClass>(`http://localhost:3000/class/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateClassApi = (token: string, id: string, formData: any) => {
    return axios.put<IClass>(
        `http://localhost:3000/update-class/${id}`,
        formData,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};

export const deleteClassApi = (token: string, id: string) => {
    return axios.delete(`http://localhost:3000/delete-class/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
