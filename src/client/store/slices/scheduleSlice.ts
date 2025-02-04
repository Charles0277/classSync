import { GlobalSchedule, IIndividualSchedule } from '@/common/types/ISchedule';
import { createSlice } from '@reduxjs/toolkit';

interface scheduleState {
    globalSchedule?: GlobalSchedule;
    userSchedule?: IIndividualSchedule;
    loading: boolean;
    error: string | null;
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
        }
    }
});

export const {
    getGlobalScheduleRequest,
    getGlobalScheduleSuccess,
    getGlobalScheduleFailure,
    getUserScheduleRequest,
    getUserScheduleSuccess,
    getUserScheduleFailure
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
