import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { IUser } from '../../../common/types/IUser';
import {
    logInFailure,
    logInRequest,
    logInSuccess,
    signUpFailure,
    signUpRequest,
    signUpSuccess
} from '../slices/authSlice';
import { logInApi, signUpApi } from '../../api/authApi';

function* signUp(action: any) {
    try {
        const { firstName, lastName, email, password, confirmPassword } =
            action.payload;
        const response: AxiosResponse<IUser> = yield call(
            signUpApi,
            firstName,
            lastName,
            email,
            password,
            confirmPassword
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

export default function* authSaga() {
    yield takeLatest(signUpRequest.type, signUp);
    yield takeLatest(logInRequest.type, logIn);
}
