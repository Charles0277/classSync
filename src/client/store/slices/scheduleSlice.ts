import {
    IGlobalScheduleEntry,
    IUserScheduleEntry
} from '@/common/types/ISchedule';
import { createSlice } from '@reduxjs/toolkit';
import { logOut } from './authSlice';

interface scheduleState {
    globalSchedule?: IGlobalScheduleEntry[];
    userSchedule?: IUserScheduleEntry[];
    loading: boolean;
    hasLoaded: boolean;
    generateSemester1Loading?: boolean;
    generateSemester2Loading?: boolean;
    error: string | null;
    popUpClass?: IUserScheduleEntry;
}

const initialState: scheduleState = {
    loading: false,
    hasLoaded: false,
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
            state.hasLoaded = true;
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
            state.hasLoaded = true;
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
            if (action.payload.semester === 1) {
                state.generateSemester1Loading = true;
            } else {
                state.generateSemester2Loading = true;
            }
            state.error = null;
        },
        generateGlobalScheduleSuccess: (state, action) => {
            state.globalSchedule = action.payload;
            state.generateSemester1Loading = false;
            state.generateSemester2Loading = false;
        },
        generateGlobalScheduleFailure: (state, action) => {
            state.error = action.payload;
            state.generateSemester1Loading = false;
            state.generateSemester2Loading = false;
        }
    },
    extraReducers(builder) {
        builder.addCase(logOut, (state) => {
            state.userSchedule = undefined;
            state.globalSchedule = undefined;
        });
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
