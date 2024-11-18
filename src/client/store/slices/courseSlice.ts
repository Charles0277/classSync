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
        }
    }
});

export const {
    fetchAllCoursesRequest,
    fetchAllCoursesSuccess,
    fetchAllCoursesFailure,
    deleteCourseRequest,
    deleteCourseSuccess,
    deleteCourseFailure
} = courseSlice.actions;

export default courseSlice.reducer;
