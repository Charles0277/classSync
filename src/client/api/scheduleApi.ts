import {
    IFriendsScheduleEntry,
    IGlobalSchedule,
    IGlobalScheduleEntry,
    IUserScheduleEntry
} from '@/common/types/ISchedule';
import axios from 'axios';
import { Types } from 'mongoose';

export const getGlobalScheduleApi = (token: string) => {
    return axios.get<IGlobalScheduleEntry[]>(
        `http://localhost:3000/get-global-schedule`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const getUserScheduleApi = (token: string, id: string, role: string) => {
    return axios.get<IUserScheduleEntry[]>(
        `http://localhost:3000/get-user-schedule/${id}`,
        {
            params: { role: role },
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};

export const generateGlobalScheduleApi = (token: string, semester: number) => {
    return axios.post<IGlobalSchedule>(
        `http://localhost:3000/generate-global-schedule/`,
        { semester: semester },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const updateGlobalScheduleEntryApi = (
    token: string,
    id: string,
    formData: any
) => {
    return axios.put<IGlobalScheduleEntry>(
        `http://localhost:3000/update-global-schedule/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const deleteGlobalScheduleEntryApi = (token: string, id: string) => {
    return axios.delete<IGlobalScheduleEntry>(
        `http://localhost:3000/delete-global-schedule/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const addGlobalScheduleEntryApi = (token: string, formData: any) => {
    return axios.put<IGlobalScheduleEntry>(
        `http://localhost:3000/add-global-schedule-entry`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const checkForConflictsApi = (token: string, formData: any) => {
    return axios.post<IGlobalScheduleEntry[]>(
        `http://localhost:3000/check-for-conflicts`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const getFriendsScheduleApi = (
    token: string,
    friendIds: Types.ObjectId[]
) => {
    return axios.get<IFriendsScheduleEntry[]>(
        `http://localhost:3000/get-friends-schedule`,
        {
            params: { friendIds },
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};
