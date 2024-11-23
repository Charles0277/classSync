import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { IUser } from '../../../common/types/IUser';
import {
    deleteUserApi,
    getTeachersApi,
    getUsersApi,
    updateUserApi
} from '../../api/userApi';
import {
    deleteUserFailure,
    deleteUserRequest,
    deleteUserSuccess,
    fetchTeachersFailure,
    fetchTeachersRequest,
    fetchTeachersSuccess,
    fetchUsersFailure,
    fetchUsersRequest,
    fetchUsersSuccess,
    updateUserFailure,
    updateUserRequest,
    updateUserSuccess
} from '../slices/userSlice';

function* handleFetchUsers(action: any) {
    const { token } = action.payload;

    try {
        const response: AxiosResponse<IUser[]> = yield call(getUsersApi, token);
        yield put(fetchUsersSuccess(response.data));
    } catch (error: any) {
        yield put(fetchUsersFailure(error.message));
    }
}

function* handleFetchTeachers(action: any) {
    const { token } = action.payload;

    try {
        const response: AxiosResponse<IUser[]> = yield call(
            getTeachersApi,
            token
        );
        yield put(fetchTeachersSuccess(response.data));
    } catch (error: any) {
        yield put(fetchTeachersFailure(error.message));
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
    yield takeLatest(fetchUsersRequest.type, handleFetchUsers);
    yield takeLatest(fetchTeachersRequest.type, handleFetchTeachers);
    yield takeLatest(updateUserRequest.type, handleUpdateUser);
    yield takeLatest(deleteUserRequest.type, handleDeleteUser);
}
