import { createSlice } from '@reduxjs/toolkit';
import { ICourseUnit } from '../../../common/types/ICourseUnit.js';

interface courseUnitState {
    courseUnit?: ICourseUnit;
    courseUnits: ICourseUnit[];
    loading: boolean;
    error: string | null;
    isCourseUnitAdded: boolean;
    isCourseUnitDeleted: boolean;
    isCourseUnitUpdated: boolean;
}

const initialState: courseUnitState = {
    courseUnits: [],
    loading: false,
    error: null,
    isCourseUnitAdded: false,
    isCourseUnitDeleted: false,
    isCourseUnitUpdated: false
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
            state.isCourseUnitDeleted = true;
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
            state.isCourseUnitUpdated = true;
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
            state.isCourseUnitAdded = true;
        },
        createCourseUnitFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        resetCourseUnitAdded: (state) => {
            state.isCourseUnitAdded = false;
        },
        resetCourseUnitDeleted: (state) => {
            state.isCourseUnitDeleted = false;
        },
        resetCourseUnitUpdated: (state) => {
            state.isCourseUnitUpdated = false;
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
    createCourseUnitFailure,
    resetCourseUnitAdded,
    resetCourseUnitDeleted,
    resetCourseUnitUpdated
} = courseUnitSlice.actions;

export default courseUnitSlice.reducer;
