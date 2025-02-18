import {
    IGlobalSchedule,
    IIndividualScheduleEntry
} from '@/common/types/ISchedule';
import axios from 'axios';

export const getGlobalScheduleApi = (token: string) => {
    return axios.get<IGlobalSchedule>(
        `http://localhost:3000/get-global-schedule`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const getUserScheduleApi = (token: string, id: string) => {
    return axios.get<IIndividualScheduleEntry>(
        `http://localhost:3000/get-user-schedule/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const generateGlobalScheduleApi = (token: string, semester: number) => {
    return axios.post<IGlobalSchedule>(
        `http://localhost:3000/generate-global-schedule/`,
        { semester: semester },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};
