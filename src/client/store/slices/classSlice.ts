import { IClass } from '@/common/types/IClass.js';
import { createSlice } from '@reduxjs/toolkit';

interface classState {
    classEntity?: IClass;
    error?: string | null;
    loading: boolean;
}

const initialState: classState = { loading: false };

const classSlice = createSlice({
    name: 'class',
    initialState,
    reducers: {
        getClassRequest: (state, action) => {
            state.loading = true;
        },
        getClassSuccess: (state, action) => {
            state.classEntity = action.payload;
            state.loading = false;
        },
        getClassFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateClassRequest: (state, action) => {
            state.loading = true;
        },
        updateClassSuccess: (state, action) => {
            state.classEntity = action.payload;
            state.loading = false;
        },
        updateClassFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        resetClassEntity: (state) => {
            state.classEntity = undefined;
        },
        deleteClassRequest: (state, action) => {
            state.loading = true;
        },
        deleteClassSuccess: (state, action) => {
            state.loading = false;
            state.classEntity = undefined;
        },
        deleteClassFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const {
    getClassRequest,
    getClassSuccess,
    getClassFailure,
    updateClassRequest,
    updateClassSuccess,
    updateClassFailure,
    resetClassEntity,
    deleteClassRequest,
    deleteClassSuccess,
    deleteClassFailure
} = classSlice.actions;

export default classSlice.reducer;
