import { IHoliday } from '@/common/types/IHoliday';
import { createSlice } from '@reduxjs/toolkit';
import { DateRange } from 'react-day-picker';

interface holidayState {
    holiday?: IHoliday;
    holidays: IHoliday[];
    error?: string | null;
    loading: boolean;
    date?: DateRange;
}

const initialState: holidayState = { loading: false, holidays: [] };

const holidaySlice = createSlice({
    name: 'holiday',
    initialState,
    reducers: {
        getAllHolidaysRequest: (state, action) => {
            state.loading = true;
        },
        getAllHolidaysSuccess: (state, action) => {
            state.holidays = action.payload;
            state.loading = false;
        },
        getAllHolidaysFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateHolidayRequest: (state, action) => {
            state.loading = true;
        },
        updateHolidaySuccess: (state, action) => {
            const updatedHoliday = action.payload;
            state.holidays = state.holidays.map((holiday) =>
                holiday._id === updatedHoliday._id ? updatedHoliday : holiday
            );
            state.loading = false;
        },
        updateHolidayFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        createHolidayRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        createHolidaySuccess: (state, action) => {
            const newHoliday = action.payload;
            state.holiday = newHoliday;
            state.holidays = [newHoliday, ...state.holidays];
            state.loading = false;
        },
        createHolidayFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteHolidayRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        deleteHolidaySuccess: (state, action) => {
            state.loading = false;
            const deletedHolidayId = action.payload._id;
            state.holidays = state.holidays.filter(
                (holiday) => holiday._id !== deletedHolidayId
            );
            state.loading = false;
        },
        deleteHolidayFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    getAllHolidaysRequest,
    getAllHolidaysSuccess,
    getAllHolidaysFailure,
    updateHolidayRequest,
    updateHolidaySuccess,
    updateHolidayFailure,
    createHolidayRequest,
    createHolidaySuccess,
    createHolidayFailure,
    deleteHolidayRequest,
    deleteHolidaySuccess,
    deleteHolidayFailure
} = holidaySlice.actions;

export default holidaySlice.reducer;
