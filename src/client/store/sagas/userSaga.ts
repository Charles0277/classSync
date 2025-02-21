import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { IUser } from '../../../common/types/IUser';
import {
    deleteUserApi,
    getAllTeachersApi,
    getAllUsersApi,
    getUsersApi,
    updateUserApi
} from '../../api/userApi';
import {
    deleteUserFailure,
    deleteUserRequest,
    deleteUserSuccess,
    fetchAllTeachersFailure,
    fetchAllTeachersRequest,
    fetchAllTeachersSuccess,
    fetchAllUsersFailure,
    fetchAllUsersRequest,
    fetchAllUsersSuccess,
    fetchUsersFailure,
    fetchUsersRequest,
    fetchUsersSuccess,
    updateUserFailure,
    updateUserRequest,
    updateUserSuccess
} from '../slices/userSlice';

function* handleFetchAllUsers(action: any) {
    const { token } = action.payload;

    try {
        const response: AxiosResponse<IUser[]> = yield call(
            getAllUsersApi,
            token
        );
        yield put(fetchAllUsersSuccess(response.data));
    } catch (error: any) {
        yield put(fetchAllUsersFailure(error.message));
    }
}

function* handleFetchUsers(action: any) {
    const { token, studentsIds } = action.payload;

    try {
        const response: AxiosResponse<IUser[]> = yield call(
            getUsersApi,
            token,
            studentsIds
        );
        yield put(fetchUsersSuccess(response.data));
    } catch (error: any) {
        yield put(fetchUsersFailure(error.message));
    }
}

function* handleFetchAllTeachers(action: any) {
    const { token } = action.payload;

    try {
        const response: AxiosResponse<IUser[]> = yield call(
            getAllTeachersApi,
            token
        );
        yield put(fetchAllTeachersSuccess(response.data));
    } catch (error: any) {
        yield put(fetchAllTeachersFailure(error.message));
    }
}

function* handleUpdateUser(action: any) {
    let { id, formData, token } = action.payload;
    if (formData.password === '') {
        delete formData.password;
        delete formData.confirmPassword;
    }
    try {
        const response: AxiosResponse<IUser> = yield call(
            updateUserApi,
            id,
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
    yield takeLatest(fetchAllUsersRequest.type, handleFetchAllUsers);
    yield takeLatest(fetchUsersRequest.type, handleFetchUsers);
    yield takeLatest(fetchAllTeachersRequest.type, handleFetchAllTeachers);
    yield takeLatest(updateUserRequest.type, handleUpdateUser);
    yield takeLatest(deleteUserRequest.type, handleDeleteUser);
}
