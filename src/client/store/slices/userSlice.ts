import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../../common/types/IUser';
import { signUpSuccess } from './authSlice';

interface UserState {
    users: IUser[];
    allUsers: IUser[];
    user?: IUser;
    loading: boolean;
    error: string | null;
    friendError: string | null;
    students: IUser[];
    teachers: IUser[];
    studentsLoading?: boolean;
    isUserUpdated: boolean;
    isUserDeleted: boolean;
    addFriendSuccess: boolean;
}

const initialState: UserState = {
    users: [],
    allUsers: [],
    students: [],
    teachers: [],
    loading: false,
    error: null,
    friendError: null,
    isUserUpdated: false,
    isUserDeleted: false,
    addFriendSuccess: false
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
            state.allUsers = action.payload;
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
            state.allUsers = state.allUsers.map((user) =>
                user._id === updatedUser._id ? updatedUser : user
            );
            state.loading = false;
            state.isUserUpdated = true;
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
            state.allUsers = state.allUsers.filter(
                (user) => user._id !== deletedUserId
            );
            state.isUserDeleted = true;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        resetStudents: (state) => {
            state.students = [];
        },
        resetUserUpdated: (state) => {
            state.isUserUpdated = false;
        },
        resetUserDeleted: (state) => {
            state.isUserDeleted = false;
        },
        addFriendRequest: (state, action) => {
            state.loading = true;
        },
        addFriendSuccess: (state, action) => {
            state.loading = false;
        },
        addFriendFailure: (state, action) => {
            state.loading = false;
            state.friendError = action.payload;
        },
        removeFriendRequest: (state, action) => {
            state.loading = true;
        },
        removeFriendSuccess: (state, action) => {
            state.loading = false;
        },
        removeFriendFailure: (state, action) => {
            state.loading = false;
            state.friendError = action.payload;
        },
        resetAddFriendSuccess: (state) => {
            state.addFriendSuccess = false;
        },
        resetFriendError: (state) => {
            state.friendError = null;
        }
    },
    extraReducers(builder) {
        builder.addCase(signUpSuccess, (state, action) => {
            state.allUsers.push(action.payload);
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
    resetStudents,
    resetUserUpdated,
    resetUserDeleted,
    addFriendRequest,
    addFriendSuccess,
    addFriendFailure,
    removeFriendRequest,
    removeFriendSuccess,
    removeFriendFailure,
    resetAddFriendSuccess,
    resetFriendError
} = userSlice.actions;

export default userSlice.reducer;
