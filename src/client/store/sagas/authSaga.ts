import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { IUser } from '../../../common/types/IUser';
import { logInFailure, logInRequest, logInSuccess } from '../slices/authSlice';
import { logInApi } from '../../api/authApi';
import { PayloadAction } from '@reduxjs/toolkit';

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
    yield takeLatest(logInRequest.type, logIn);
}
