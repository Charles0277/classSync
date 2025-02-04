import { IGlobalSchedule, IIndividualSchedule } from '@/common/types/ISchedule';
import axios from 'axios';

export const getGlobalScheduleApi = (token: string) => {
    return axios.get<IGlobalSchedule>(
        `http://localhost:3000/get-global-schedule`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const getUserScheduleApi = (token: string, id: string) => {
    return axios.get<IIndividualSchedule>(
        `http://localhost:3000/get-user-schedule/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};
