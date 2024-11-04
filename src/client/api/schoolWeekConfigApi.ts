import axios from 'axios';
import { ISchoolWeekConfig } from '../../common/types/ISchoolWeekConfig';

export const getConfigApi = (token: string) => {
    return axios.get<ISchoolWeekConfig>(
        `http://localhost:3000/school-week-config`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const updateConfigApi = (
    token: string,
    updatedConfig: ISchoolWeekConfig
) => {
    return axios.post<ISchoolWeekConfig>(
        `http://localhost:3000/update-school-week-config`,
        updatedConfig,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};
