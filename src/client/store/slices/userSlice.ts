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
    friendRequestSent: boolean;
    removeFriendSuccess: boolean;
    sendFriendRequestLoading: boolean;
    acceptFriendRequestSuccess: boolean;
    declineFriendRequestSuccess: boolean;
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
    friendRequestSent: false,
    removeFriendSuccess: false,
    sendFriendRequestLoading: false,
    acceptFriendRequestSuccess: false,
    declineFriendRequestSuccess: false
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
        sendFriendRequest: (state, action) => {
            state.sendFriendRequestLoading = true;
        },
        sendFriendSuccess: (state, action) => {
            state.sendFriendRequestLoading = false;
            state.friendRequestSent = true;
        },
        sendFriendFailure: (state, action) => {
            state.sendFriendRequestLoading = false;
            state.friendError = action.payload;
        },
        removeFriendRequest: (state, action) => {
            state.loading = true;
        },
        removeFriendSuccess: (state, action) => {
            state.loading = false;
            state.removeFriendSuccess = true;
        },
        removeFriendFailure: (state, action) => {
            state.loading = false;
            state.friendError = action.payload;
        },
        resetFriendRequestSent: (state) => {
            state.friendRequestSent = false;
        },
        resetRemoveFriendSuccess: (state) => {
            state.removeFriendSuccess = false;
        },
        resetFriendError: (state) => {
            state.friendError = null;
        },
        acceptFriendRequest: (state, action) => {},
        acceptFriendSuccess: (state, action) => {
            state.acceptFriendRequestSuccess = true;
        },
        acceptFriendFailure: (state, action) => {
            state.friendError = action.payload;
        },
        declineFriendRequest: (state, action) => {},
        declineFriendSuccess: (state, action) => {
            state.declineFriendRequestSuccess = true;
        },
        declineFriendFailure: (state, action) => {
            state.friendError = action.payload;
        },
        resetAcceptFriendRequestSuccess: (state) => {
            state.acceptFriendRequestSuccess = false;
        },
        resetDeclineFriendRequestSuccess: (state) => {
            state.declineFriendRequestSuccess = false;
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
    sendFriendRequest,
    sendFriendSuccess,
    sendFriendFailure,
    removeFriendRequest,
    removeFriendSuccess,
    removeFriendFailure,
    resetFriendRequestSent,
    resetRemoveFriendSuccess,
    resetFriendError,
    acceptFriendRequest,
    acceptFriendSuccess,
    acceptFriendFailure,
    declineFriendRequest,
    declineFriendSuccess,
    declineFriendFailure,
    resetAcceptFriendRequestSuccess,
    resetDeclineFriendRequestSuccess
} = userSlice.actions;

export default userSlice.reducer;
