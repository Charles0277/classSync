import {
    GlobalSchedule,
    IIndividualScheduleEntry
} from '@/common/types/ISchedule';
import { createSlice } from '@reduxjs/toolkit';

interface scheduleState {
    globalSchedule?: GlobalSchedule;
    userSchedule?: IIndividualScheduleEntry[];
    loading: boolean;
    error: string | null;
    popUpClass?: IIndividualScheduleEntry;
}

const initialState: scheduleState = {
    loading: false,
    error: null
};

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        getGlobalScheduleRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        getGlobalScheduleSuccess: (state, action) => {
            state.globalSchedule = action.payload;
            state.loading = false;
        },
        getGlobalScheduleFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        getUserScheduleRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        getUserScheduleSuccess: (state, action) => {
            state.userSchedule = action.payload;
            state.loading = false;
        },
        getUserScheduleFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        openPopUp: (state, action) => {
            state.popUpClass = action.payload;
        },
        closePopUp: (state) => {
            state.popUpClass = undefined;
        },
        generateGlobalScheduleRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        generateGlobalScheduleSuccess: (state, action) => {
            state.globalSchedule = action.payload;
            state.loading = false;
        },
        generateGlobalScheduleFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    getGlobalScheduleRequest,
    getGlobalScheduleSuccess,
    getGlobalScheduleFailure,
    getUserScheduleRequest,
    getUserScheduleSuccess,
    getUserScheduleFailure,
    generateGlobalScheduleRequest,
    generateGlobalScheduleSuccess,
    generateGlobalScheduleFailure,
    openPopUp,
    closePopUp
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
