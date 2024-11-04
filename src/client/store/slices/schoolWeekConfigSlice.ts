import { createSlice } from '@reduxjs/toolkit';
import { ISchoolWeekConfig } from '../../../common/types/ISchoolWeekConfig';

interface schoolWeekConfigState {
    schoolWeekConfig?: ISchoolWeekConfig;
    loading: boolean;
    error: string | null;
}

const initialState: schoolWeekConfigState = {
    loading: false,
    error: null
};

const schoolWeekConfigSlice = createSlice({
    name: 'schoolWeekConfig',
    initialState,
    reducers: {
        getConfigRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        getConfigSuccess: (state, action) => {
            state.schoolWeekConfig = action.payload;
            state.loading = false;
        },
        getConfigFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateConfigRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        updateConfigSuccess: (state, action) => {
            state.schoolWeekConfig = action.payload;
            state.loading = false;
        },
        updateConfigFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    getConfigRequest,
    getConfigSuccess,
    getConfigFailure,
    updateConfigRequest,
    updateConfigSuccess,
    updateConfigFailure
} = schoolWeekConfigSlice.actions;

export default schoolWeekConfigSlice.reducer;
