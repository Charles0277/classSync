import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { IUser } from '../../../common/types/IUser';
import {
    getUsersRequest,
    getUsersSuccess,
    getUsersFailure,
    updateUserSuccess,
    updateUserFailure,
    updateUserRequest,
    deleteUserSuccess,
    deleteUserFailure,
    deleteUserRequest
} from '../slices/userSlice';
import { deleteUserApi, getUsersApi, updateUserApi } from '../../api/userApi';

function* fetchUsers(action: any) {
    const { token } = action.payload;

    try {
        const response: AxiosResponse<IUser[]> = yield call(getUsersApi, token);
        yield put(getUsersSuccess(response.data));
    } catch (error: any) {
        yield put(getUsersFailure(error.message));
    }
}

function* handleUpdateUser(action: any) {
    const { formData, token } = action.payload;
    try {
        const response: AxiosResponse<IUser> = yield call(
            updateUserApi,
            formData,
            token
        );
        yield put(updateUserSuccess(response.data));
    } catch (error: any) {
        yield put(updateUserFailure(error.message));
    }
}

function* handleDeleteUser(action: any) {
    const { id, token } = action.payload;
    try {
        const response: AxiosResponse<IUser> = yield call(
            deleteUserApi,
            id,
            token
        );
        yield put(deleteUserSuccess(response.data));
    } catch (error: any) {
        yield put(deleteUserFailure(error.message));
    }
}

export default function* userSaga() {
    yield takeLatest(getUsersRequest.type, fetchUsers);
    yield takeLatest(updateUserRequest.type, handleUpdateUser);
    yield takeLatest(deleteUserRequest.type, handleDeleteUser);
}
