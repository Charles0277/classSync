import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { IRoom } from '../../../common/types/IRoom';
import { fetchRoomsApi } from '../../api/roomApi';
import {
    fetchAllRoomsFailure,
    fetchAllRoomsRequest,
    fetchAllRoomsSuccess
} from '../slices/roomSlice';

function* handleFetchAllRooms(action: any) {
    const { token } = action.payload;

    try {
        const response: AxiosResponse<IRoom[]> = yield call(
            fetchRoomsApi,
            token
        );
        yield put(fetchAllRoomsSuccess(response.data));
    } catch (error: any) {
        yield put(fetchAllRoomsFailure(error.message));
    }
}

export default function* roomSaga() {
    yield takeLatest(fetchAllRoomsRequest.type, handleFetchAllRooms);
}
