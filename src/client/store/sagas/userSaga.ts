import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { IUser } from '../../../common/types/IUser';
import {
    getUsersRequest,
    getUsersSuccess,
    getUsersFailure
} from '../slices/userSlice';
import { getUsersApi } from '../../api/userApi';

function* fetchUsers(action: any) {
    const { token } = action.payload;

    try {
        const response: AxiosResponse<IUser[]> = yield call(getUsersApi, token);
        yield put(getUsersSuccess(response.data));
    } catch (error: any) {
        yield put(getUsersFailure(error.message));
    }
}

export default function* userSaga() {
    yield takeLatest(getUsersRequest.type, fetchUsers);
}
