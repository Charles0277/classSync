import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../../common/types/IUser';

interface UserState {
    users: IUser[];
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
        }
    }
});

export const { getUsersRequest, getUsersSuccess, getUsersFailure } =
    userSlice.actions;

export default userSlice.reducer;
