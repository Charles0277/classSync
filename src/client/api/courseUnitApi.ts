import axios from 'axios';
import { ICourseUnit } from '../../common/types/ICourseUnit.js';

export const fetchCourseUnitsApi = () => {
    return axios.get<ICourseUnit[]>(`http://localhost:3000/course-units`);
};

// export const deleteCourseApi = (id: string, token: string) => {
//     return axios.delete<ICourse>(`http://localhost:3000/delete-course/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//     });
// };
