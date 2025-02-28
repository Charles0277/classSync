import { createSlice } from '@reduxjs/toolkit';
import { ICourse } from '../../../common/types/ICourse';

interface courseState {
    course?: ICourse;
    courses: ICourse[];
    loading: boolean;
    error: string | null;
}

const initialState: courseState = {
    courses: [],
    loading: false,
    error: null
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
        },
        createCourseFailure: (state, action) => {
            state.loading = false;
            console.log('🚀 ~ action.payload:', action.payload);
            state.error = action.payload;
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
    createCourseFailure
} = courseSlice.actions;

export default courseSlice.reducer;
