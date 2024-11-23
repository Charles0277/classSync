import { createSlice } from '@reduxjs/toolkit';
import { ICourseUnit } from '../../../common/types/ICourseUnit.js';

interface courseUnitState {
    courseUnit?: ICourseUnit;
    courseUnits: ICourseUnit[];
    loading: boolean;
    error: string | null;
}

const initialState: courseUnitState = {
    courseUnits: [],
    loading: false,
    error: null
};

const courseUnitSlice = createSlice({
    name: 'courseUnit',
    initialState,
    reducers: {
        fetchAllCourseUnitsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchAllCourseUnitsSuccess: (state, action) => {
            state.courseUnits = action.payload;
            state.loading = false;
        },
        fetchAllCourseUnitsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteCourseUnitRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        deleteCourseUnitSuccess: (state, action) => {
            const deletedCourseUnitId = action.payload._id;
            state.courseUnits = state.courseUnits.filter(
                (courseUnit) => courseUnit._id !== deletedCourseUnitId
            );
            state.loading = false;
        },
        deleteCourseUnitFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateCourseUnitRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        updateCourseUnitSuccess: (state, action) => {
            const updatedCourseUnit = action.payload;
            state.courseUnits = state.courseUnits.map((courseUnit) =>
                courseUnit._id === updatedCourseUnit._id
                    ? updatedCourseUnit
                    : courseUnit
            );
            state.loading = false;
        },
        updateCourseUnitFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        createCourseUnitRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        createCourseUnitSuccess: (state, action) => {
            const newCourse = action.payload;
            state.courseUnits = [...state.courseUnits, newCourse];
            state.loading = false;
        },
        createCourseUnitFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    fetchAllCourseUnitsRequest,
    fetchAllCourseUnitsSuccess,
    fetchAllCourseUnitsFailure,
    deleteCourseUnitRequest,
    deleteCourseUnitSuccess,
    deleteCourseUnitFailure,
    updateCourseUnitRequest,
    updateCourseUnitSuccess,
    updateCourseUnitFailure,
    createCourseUnitRequest,
    createCourseUnitSuccess,
    createCourseUnitFailure
} = courseUnitSlice.actions;

export default courseUnitSlice.reducer;
