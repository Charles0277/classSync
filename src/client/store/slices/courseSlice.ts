import { createSlice } from '@reduxjs/toolkit';
import { ICourse } from '../../../common/types/ICourse';

interface courseState {
    course?: ICourse;
    courses: ICourse[];
    loading: boolean;
    error: string | null;
    isCourseAdded: boolean;
    isCourseDeleted: boolean;
    isCourseUpdated: boolean;
}

const initialState: courseState = {
    courses: [],
    loading: false,
    error: null,
    isCourseAdded: false,
    isCourseDeleted: false,
    isCourseUpdated: false
};

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        fetchAllCoursesRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchAllCoursesSuccess: (state, action) => {
            state.courses = action.payload;
            state.loading = false;
        },
        fetchAllCoursesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteCourseRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        deleteCourseSuccess: (state, action) => {
            const deletedCourseId = action.payload._id;
            state.courses = state.courses.filter(
                (course) => course._id !== deletedCourseId
            );
            state.loading = false;
            state.isCourseDeleted = true;
        },
        deleteCourseFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateCourseRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        updateCourseSuccess: (state, action) => {
            const updatedCourse = action.payload;
            state.courses = state.courses.map((course) =>
                course._id === updatedCourse._id ? updatedCourse : course
            );
            state.loading = false;
            state.isCourseUpdated = true;
        },
        updateCourseFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        createCourseRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        createCourseSuccess: (state, action) => {
            const newCourse = action.payload;
            state.courses = [...state.courses, newCourse];
            state.loading = false;
            state.isCourseAdded = true;
        },
        createCourseFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        resetCourseAdded: (state) => {
            state.isCourseAdded = false;
        },
        resetCourseDeleted: (state) => {
            state.isCourseDeleted = false;
        },
        resetCourseUpdated: (state) => {
            state.isCourseUpdated = false;
        }
    }
});

export const {
    fetchAllCoursesRequest,
    fetchAllCoursesSuccess,
    fetchAllCoursesFailure,
    deleteCourseRequest,
    deleteCourseSuccess,
    deleteCourseFailure,
    updateCourseRequest,
    updateCourseSuccess,
    updateCourseFailure,
    createCourseRequest,
    createCourseSuccess,
    createCourseFailure,
    resetCourseAdded,
    resetCourseDeleted,
    resetCourseUpdated
} = courseSlice.actions;

export default courseSlice.reducer;
