import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { IUser } from '../../../common/types/IUser';
import {
    checkAuthenticationFailure,
    checkAuthenticationRequest,
    checkAuthenticationSuccess,
    logInFailure,
    logInRequest,
    logInSuccess,
    signUpFailure,
    signUpRequest,
    signUpSuccess
} from '../slices/authSlice';
import { logInApi, signUpApi } from '../../api/authApi';
import { getUserApi } from '../../api/userApi';

function* signUp(action: any) {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            role,
            yearOfStudy,
            course,
            courseUnits
        } = action.payload;
        const response: AxiosResponse<IUser> = yield call(
            signUpApi,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            role,
            yearOfStudy,
            course,
            courseUnits
        );
        yield put(signUpSuccess(response.data));
    } catch (error: any) {
        yield put(signUpFailure(error.message));
    }
}

function* logIn(action: any) {
    try {
        const { email, password } = action.payload;
        const response: AxiosResponse<IUser> = yield call(
            logInApi,
            email,
            password
        );
        yield put(logInSuccess(response.data));
    } catch (error: any) {
        yield put(logInFailure(error.message));
    }
}

function* checkAuthentication(action: any) {
    try {
        const { email } = action.payload;
        const response: AxiosResponse<IUser> = yield call(getUserApi, email);
        yield put(checkAuthenticationSuccess(response.data));
    } catch (error: any) {
        yield put(checkAuthenticationFailure(error.message));
    }
}

export default function* authSaga() {
    yield takeLatest(signUpRequest.type, signUp);
    yield takeLatest(logInRequest.type, logIn);
    yield takeLatest(checkAuthenticationRequest.type, checkAuthentication);
}
