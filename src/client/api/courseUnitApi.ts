import axios from 'axios';
import { ICourseUnit } from '../../common/types/ICourseUnit.js';

export const fetchCourseUnitsApi = () => {
    return axios.get<ICourseUnit[]>(`http://localhost:3000/course-units`);
};

export const deleteCourseUnitApi = (id: string, token: string) => {
    return axios.delete<ICourseUnit>(
        `http://localhost:3000/delete-course-unit/${id}`,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};

export const updateCourseUnitApi = (
    id: string,
    formData: any,
    token: string
) => {
    return axios.put<ICourseUnit>(
        `http://localhost:3000/update-course-unit/${id}`,
        formData,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};

export const createCourseUnitApi = (formData: any, token: string) => {
    return axios.post<ICourseUnit>(
        `http://localhost:3000/create-course-unit`,
        formData,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};
