import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../../common/types/IUser';

interface UserState {
    users: IUser[];
    loading: boolean;
    error?: string;
    currentUser?: IUser;
}

const initialState: UserState = {
    users: [],
    loading: false
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        getUsersRequest: (state, action) => {
            state.loading = true;
        },
        getUsersSuccess: (state, action) => {
            state.loading = false;
            state.users = action.payload;
        },
        getUsersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        checkOrCreateUserRequest: (state, action) => {
            state.loading = true;
        },
        checkOrCreateUserSuccess: (state, action) => {
            const currentUser = action.payload;
            state.loading = false;
            state.currentUser = currentUser;
        },
        checkOrCreateUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    getUsersRequest,
    getUsersSuccess,
    getUsersFailure,
    checkOrCreateUserRequest,
    checkOrCreateUserSuccess,
    checkOrCreateUserFailure
} = userSlice.actions;

export default userSlice.reducer;
