import axios from 'axios';
import { ICourse } from '../../common/types/ICourse.js';

export const fetchCoursesApi = () => {
    return axios.get<ICourse[]>(`http://localhost:3000/courses`);
};
