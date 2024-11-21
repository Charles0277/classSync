import axios from 'axios';
import { ICourse } from '../../common/types/ICourse.js';

export const fetchCoursesApi = () => {
    return axios.get<ICourse[]>(`http://localhost:3000/courses`);
};

export const deleteCourseApi = (id: string, token: string) => {
    return axios.delete<ICourse>(`http://localhost:3000/delete-course/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateCourseApi = (id: string, formData: any, token: string) => {
    return axios.put<ICourse>(
        `http://localhost:3000/update-course/${id}`,
        formData,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};

export const createCourseApi = (formData: any, token: string) => {
    return axios.post<ICourse>(
        `http://localhost:3000/create-course`,
        formData,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};
