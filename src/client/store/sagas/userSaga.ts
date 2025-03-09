import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { IFriend, IUser } from '../../../common/types/IUser';
import {
    addFriendApi,
    deleteUserApi,
    getAllStudentsApi,
    getAllTeachersApi,
    getAllUsersApi,
    getUsersApi,
    updateUserApi
} from '../../api/userApi';
import {
    addFriendFailure,
    addFriendRequest,
    addFriendSuccess,
    deleteUserFailure,
    deleteUserRequest,
    deleteUserSuccess,
    fetchAllStudentsFailure,
    fetchAllStudentsRequest,
    fetchAllStudentsSuccess,
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

function* handleFetchAllStudents(action: any) {
    const { token } = action.payload;

    try {
        const response: AxiosResponse<IUser[]> = yield call(
            getAllStudentsApi,
            token
        );
        yield put(fetchAllStudentsSuccess(response.data));
    } catch (error: any) {
        yield put(fetchAllStudentsFailure(error.message));
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

function* handleAddFriend(action: any) {
    const { email, token } = action.payload;

    try {
        const response: AxiosResponse<IFriend> = yield call(
            addFriendApi,
            email,
            token
        );
        yield put(addFriendSuccess(response.data));
    } catch (error: any) {
        yield put(addFriendFailure(error.message));
    }
}

export default function* userSaga() {
    yield takeLatest(fetchAllUsersRequest.type, handleFetchAllUsers);
    yield takeLatest(fetchUsersRequest.type, handleFetchUsers);
    yield takeLatest(fetchAllTeachersRequest.type, handleFetchAllTeachers);
    yield takeLatest(fetchAllStudentsRequest.type, handleFetchAllStudents);
    yield takeLatest(updateUserRequest.type, handleUpdateUser);
    yield takeLatest(deleteUserRequest.type, handleDeleteUser);
    yield takeLatest(addFriendRequest.type, handleAddFriend);
}
