import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { IFriend, IUser } from '../../../common/types/IUser';
import {
    acceptFriendRequestApi,
    declineFriendRequestApi,
    deleteUserApi,
    getAllStudentsApi,
    getAllTeachersApi,
    getAllUsersApi,
    getUsersApi,
    removeFriendApi,
    sendFriendRequestApi,
    updateUserApi
} from '../../api/userApi';
import {
    acceptFriendFailure,
    acceptFriendRequest,
    acceptFriendSuccess,
    declineFriendFailure,
    declineFriendRequest,
    declineFriendSuccess,
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
    removeFriendFailure,
    removeFriendRequest,
    removeFriendSuccess,
    sendFriendFailure,
    sendFriendRequest,
    sendFriendSuccess,
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
        yield put(fetchAllUsersFailure(error.response.data.error));
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
        yield put(fetchUsersFailure(error.response.data.error));
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
        yield put(fetchAllTeachersFailure(error.response.data.error));
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
        yield put(fetchAllStudentsFailure(error.response.data.error));
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
        yield put(updateUserFailure(error.response.data.error));
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
        yield put(deleteUserFailure(error.response.data.error));
    }
}

function* handleSendFriendRequest(action: any) {
    const { email, token } = action.payload;

    try {
        const response: AxiosResponse<IFriend> = yield call(
            sendFriendRequestApi,
            email,
            token
        );
        yield put(sendFriendSuccess(response.data));
    } catch (error: any) {
        yield put(sendFriendFailure(error.response.data.error));
    }
}

function* handleRemoveFriend(action: any) {
    const { friendId, token } = action.payload;

    try {
        const response: AxiosResponse<IFriend> = yield call(
            removeFriendApi,
            friendId,
            token
        );
        yield put(removeFriendSuccess(response.data));
    } catch (error: any) {
        yield put(removeFriendFailure(error.response.data.error));
    }
}

function* handleAcceptFriendRequest(action: any) {
    const { friendId, token } = action.payload;

    try {
        const response: AxiosResponse<IFriend> = yield call(
            acceptFriendRequestApi,
            friendId,
            token
        );
        yield put(acceptFriendSuccess(response.data));
    } catch (error: any) {
        yield put(acceptFriendFailure(error.response.data.error));
    }
}

function* handleDeclineFriendRequest(action: any) {
    const { friendId, token } = action.payload;

    try {
        const response: AxiosResponse<IFriend> = yield call(
            declineFriendRequestApi,
            friendId,
            token
        );
        yield put(declineFriendSuccess(response.data));
    } catch (error: any) {
        yield put(declineFriendFailure(error.response.data.error));
    }
}

export default function* userSaga() {
    yield takeLatest(fetchAllUsersRequest.type, handleFetchAllUsers);
    yield takeLatest(fetchUsersRequest.type, handleFetchUsers);
    yield takeLatest(fetchAllTeachersRequest.type, handleFetchAllTeachers);
    yield takeLatest(fetchAllStudentsRequest.type, handleFetchAllStudents);
    yield takeLatest(updateUserRequest.type, handleUpdateUser);
    yield takeLatest(deleteUserRequest.type, handleDeleteUser);
    yield takeLatest(removeFriendRequest.type, handleRemoveFriend);
    yield takeLatest(sendFriendRequest.type, handleSendFriendRequest);
    yield takeLatest(acceptFriendRequest.type, handleAcceptFriendRequest);
    yield takeLatest(declineFriendRequest.type, handleDeclineFriendRequest);
}
