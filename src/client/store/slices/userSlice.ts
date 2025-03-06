import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../../common/types/IUser';
import { signUpSuccess } from './authSlice';

interface UserState {
    users: IUser[];
    user?: IUser;
    loading: boolean;
    error: string | null;
    students: IUser[];
    teachers: IUser[];
    studentsLoading?: boolean;
}

const initialState: UserState = {
    users: [],
    students: [],
    teachers: [],
    loading: false,
    error: null
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        fetchAllUsersRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        fetchAllUsersSuccess: (state, action) => {
            state.loading = false;
            state.users = action.payload;
        },
        fetchAllUsersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchUsersRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        fetchUsersSuccess: (state, action) => {
            state.loading = false;
            state.users = action.payload;
        },
        fetchUsersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchAllTeachersRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        fetchAllTeachersSuccess: (state, action) => {
            state.loading = false;
            state.teachers = action.payload;
        },
        fetchAllTeachersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchAllStudentsRequest: (state, action) => {
            state.studentsLoading = true;
            state.error = null;
        },
        fetchAllStudentsSuccess: (state, action) => {
            state.loading = false;
            state.students = action.payload;
        },
        fetchAllStudentsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateUserRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        updateUserSuccess: (state, action) => {
            const updatedUser = action.payload;
            state.users = state.users.map((user) =>
                user._id === updatedUser._id ? updatedUser : user
            );
            state.loading = false;
        },
        updateUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state, action) => {
            state.loading = false;
            const deletedUserId = action.payload._id;
            state.users = state.users.filter(
                (user) => user._id !== deletedUserId
            );
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        resetStudents: (state) => {
            state.students = [];
        }
    },
    extraReducers(builder) {
        builder.addCase(signUpSuccess, (state, action) => {
            state.users.push(action.payload);
        });
    }
});

export const {
    fetchAllUsersRequest,
    fetchAllUsersSuccess,
    fetchAllUsersFailure,
    fetchUsersRequest,
    fetchUsersSuccess,
    fetchUsersFailure,
    fetchAllTeachersRequest,
    fetchAllTeachersSuccess,
    fetchAllTeachersFailure,
    fetchAllStudentsRequest,
    fetchAllStudentsSuccess,
    fetchAllStudentsFailure,
    updateUserRequest,
    updateUserSuccess,
    updateUserFailure,
    deleteUserRequest,
    deleteUserSuccess,
    deleteUserFailure,
    resetStudents
} = userSlice.actions;

export default userSlice.reducer;
