import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../../common/types/IUser';

interface UserState {
    users: IUser[];
    user?: IUser;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    loading: false,
    error: null
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        getUsersRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        getUsersSuccess: (state, action) => {
            state.loading = false;
            state.users = action.payload;
        },
        getUsersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateUserRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        updateUserSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
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
        }
    }
});

export const {
    getUsersRequest,
    getUsersSuccess,
    getUsersFailure,
    updateUserRequest,
    updateUserSuccess,
    updateUserFailure,
    deleteUserRequest,
    deleteUserSuccess,
    deleteUserFailure
} = userSlice.actions;

export default userSlice.reducer;
