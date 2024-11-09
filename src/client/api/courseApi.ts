import axios from 'axios';
import { ICourse } from '../../common/types/ICourse.js';

export const fetchCoursesApi = (token: string) => {
    return axios.get<ICourse[]>(`http://localhost:3000/courses`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
