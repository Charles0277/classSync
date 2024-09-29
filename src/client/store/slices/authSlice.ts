import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../../common/types/IUser';

interface UserState {
    user: IUser | undefined;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: undefined,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logInRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        logInSuccess: (state, action) => {
            state.loading = false;
            //Deconstruct user
            state.user = action.payload;
        },
        logInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const { logInRequest, logInSuccess, logInFailure } = authSlice.actions;

export default authSlice.reducer;
