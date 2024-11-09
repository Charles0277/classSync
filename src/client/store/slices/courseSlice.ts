import { createSlice } from '@reduxjs/toolkit';
import { ICourse } from '../../../common/types/ICourse';

interface courseState {
    course?: ICourse;
    courses?: ICourse[];
    loading: boolean;
    error: string | null;
}

const initialState: courseState = {
    loading: false,
    error: null
};

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        fetchAllCoursesRequest: (state, action) => {
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
        }
    }
});

export const {
    fetchAllCoursesRequest,
    fetchAllCoursesSuccess,
    fetchAllCoursesFailure
} = courseSlice.actions;

export default courseSlice.reducer;
