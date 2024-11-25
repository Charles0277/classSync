import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../../common/types/IUser';
import { updateUserSuccess } from './userSlice';

interface AuthState {
    user?: IUser;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    createdUser?: IUser;
}

const initialState: AuthState = {
    user: undefined,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
    isAuthenticated: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logInRequest: (state, action) => {
            state.isLoading = true;
            state.error = null;
        },
        logInSuccess: (state, action) => {
            const { existingUser, token } = action.payload;
            state.isLoading = false;
            state.user = existingUser;
            state.token = token;
            state.isAuthenticated = true;
            localStorage.setItem('token', token);
        },
        logInFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        signUpRequest: (state, action) => {
            state.isLoading = true;
            state.error = null;
        },
        signUpSuccess: (state, action) => {
            state.createdUser = action.payload;
            state.isLoading = false;
        },
        signUpFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        checkAuthenticationRequest: (state, action) => {
            state.isLoading = true;
        },
        checkAuthenticationSuccess: (state, action) => {
            const user = action.payload;
            state.isLoading = false;
            state.user = user;
            state.isAuthenticated = true;
        },
        checkAuthenticationFailure: (state, action) => {
            state.isLoading = false;
        },
        logOut: (state) => {
            state.user = undefined;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        }
    },
    extraReducers(builder) {
        builder.addCase(updateUserSuccess, (state, action) => {
            const updatedUser = action.payload;
            console.log('🚀 ~ builder.addCase ~ updatedUser:', updatedUser);
            if (state.user?._id === updatedUser._id) {
                state.user = updatedUser;
            }
        });
    }
});

export const {
    logInRequest,
    logInSuccess,
    logInFailure,
    signUpRequest,
    signUpSuccess,
    signUpFailure,
    logOut,
    checkAuthenticationRequest,
    checkAuthenticationSuccess,
    checkAuthenticationFailure
} = authSlice.actions;

export default authSlice.reducer;
