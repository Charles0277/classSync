import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { IUser } from '../../../common/types/IUser';
import {
    getUsersRequest,
    getUsersSuccess,
    getUsersFailure,
    checkOrCreateUserSuccess,
    checkOrCreateUserFailure,
    checkOrCreateUserRequest
} from '../slices/userSlice';
import { checkOrCreateUserApi, fetchUsersApi } from '../../api/usersApi';

function* fetchUsers(action: any) {
    try {
        const { token } = action.payload;
        const response: AxiosResponse<IUser[]> = yield call(
            fetchUsersApi,
            token
        );
        yield put(getUsersSuccess(response.data));
    } catch (error: any) {
        yield put(getUsersFailure(error.message));
    }
}

function* checkOrCreateUser(action: any) {
    try {
        const { token, email, auth0Id } = action.payload;
        const response: AxiosResponse<IUser[]> = yield call(
            checkOrCreateUserApi,
            token,
            email,
            auth0Id
        );
        yield put(checkOrCreateUserSuccess(response.data));
    } catch (error: any) {
        yield put(checkOrCreateUserFailure(error.message));
    }
}

export default function* userSaga() {
    yield takeLatest(getUsersRequest.type, fetchUsers);
    yield takeLatest(checkOrCreateUserRequest.type, checkOrCreateUser);
}
