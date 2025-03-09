import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../../common/types/IUser';
import { addFriendSuccess, updateUserSuccess } from './userSlice';

interface AuthState {
    user?: IUser;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    createdUser?: IUser;
    loggingIn: boolean;
    signingUp: boolean;
    mode: 'logIn' | 'signUp' | undefined;
}

const initialState: AuthState = {
    user: undefined,
    token: localStorage.getItem('token'),
    isLoading: Boolean(localStorage.getItem('token')),

    error: null,
    isAuthenticated: false,
    loggingIn: false,
    signingUp: false,
    mode: undefined
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logInRequest: (state, action) => {
            state.loggingIn = true;
            state.error = null;
        },
        logInSuccess: (state, action) => {
            const { user, token } = action.payload;
            state.loggingIn = false;
            state.user = user;
            state.token = token;
            state.isAuthenticated = user;
            localStorage.setItem('token', token);
        },
        logInFailure: (state, action) => {
            state.loggingIn = false;
            state.error = action.payload;
        },
        signUpRequest: (state, action) => {
            state.signingUp = true;
            state.error = null;
        },
        signUpSuccess: (state, action) => {
            state.createdUser = action.payload;
            state.signingUp = false;
            state.mode = undefined;
        },
        signUpFailure: (state, action) => {
            state.signingUp = false;
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
            state.isLoading = false;
        },
        setMode: (state, action) => {
            state.mode = action.payload;
        },
        resetCreatedUser: (state) => {
            state.createdUser = undefined;
        }
    },
    extraReducers(builder) {
        builder.addCase(updateUserSuccess, (state, action) => {
            const updatedUser = action.payload;
            if (state.user?._id === updatedUser._id) {
                state.user = updatedUser;
            }
        }),
            builder.addCase(addFriendSuccess, (state, action) => {
                state.user?.friends?.push(action.payload);
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
    checkAuthenticationFailure,
    setMode,
    resetCreatedUser
} = authSlice.actions;

export default authSlice.reducer;
