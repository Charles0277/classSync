import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { IRoom } from '../../../common/types/IRoom';
import {
    createRoomApi,
    deleteRoomApi,
    fetchRoomsApi,
    updateRoomApi
} from '../../api/roomApi';
import {
    createRoomFailure,
    createRoomRequest,
    createRoomSuccess,
    deleteRoomFailure,
    deleteRoomRequest,
    deleteRoomSuccess,
    fetchAllRoomsFailure,
    fetchAllRoomsRequest,
    fetchAllRoomsSuccess,
    updateRoomFailure,
    updateRoomRequest,
    updateRoomSuccess
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

function* handleDeleteRoom(action: any) {
    const { id, token } = action.payload;
    try {
        const response: AxiosResponse<IRoom> = yield call(
            deleteRoomApi,
            id,
            token
        );
        yield put(deleteRoomSuccess(response.data));
    } catch (error: any) {
        yield put(deleteRoomFailure(error.message));
    }
}

function* handleUpdateRoom(action: any) {
    const { id, formData, token } = action.payload;
    try {
        const response: AxiosResponse<IRoom> = yield call(
            updateRoomApi,
            id,
            formData,
            token
        );
        yield put(updateRoomSuccess(response.data));
    } catch (error: any) {
        yield put(updateRoomFailure(error.message));
    }
}

function* handleCreateRoom(action: any) {
    const { formData, token } = action.payload;
    try {
        const response: AxiosResponse<IRoom> = yield call(
            createRoomApi,
            formData,
            token
        );
        yield put(createRoomSuccess(response.data));
    } catch (error: any) {
        yield put(createRoomFailure(error.message));
    }
}

export default function* roomSaga() {
    yield takeLatest(fetchAllRoomsRequest.type, handleFetchAllRooms);
    yield takeLatest(deleteRoomRequest.type, handleDeleteRoom);
    yield takeLatest(updateRoomRequest.type, handleUpdateRoom);
    yield takeLatest(createRoomRequest.type, handleCreateRoom);
}
