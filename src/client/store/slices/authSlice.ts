import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../../common/types/IUser';

interface AuthState {
    user: IUser | undefined;
    token: string | undefined;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: undefined,
    token: undefined,
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
            const { existingUser, token } = action.payload;
            state.loading = false;
            state.user = existingUser;
            state.token = token;
        },
        logInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signUpRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        signUpSuccess: (state, action) => {
            state.loading = false;
        },
        signUpFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    logInRequest,
    logInSuccess,
    logInFailure,
    signUpRequest,
    signUpSuccess,
    signUpFailure
} = authSlice.actions;

export default authSlice.reducer;
