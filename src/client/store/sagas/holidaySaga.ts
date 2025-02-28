import {
    createHolidayApi,
    deleteHolidayApi,
    getAllHolidaysApi,
    updateHolidayApi
} from '@/client/api/holidayApi';
import { IHoliday } from '@/common/types/IHoliday';
import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
    createHolidayFailure,
    createHolidayRequest,
    createHolidaySuccess,
    deleteHolidayFailure,
    deleteHolidayRequest,
    deleteHolidaySuccess,
    getAllHolidaysFailure,
    getAllHolidaysRequest,
    getAllHolidaysSuccess,
    updateHolidayFailure,
    updateHolidayRequest,
    updateHolidaySuccess
} from '../slices/holidaySlice';

function* handleGetAllHolidays(action: any) {
    const { token } = action.payload;

    try {
        const response: AxiosResponse<IHoliday[]> = yield call(
            getAllHolidaysApi,
            token
        );
        yield put(getAllHolidaysSuccess(response.data));
    } catch (error: any) {
        yield put(getAllHolidaysFailure(error.response.data.error));
    }
}

function* handleDeleteHoliday(action: any) {
    const { id, token } = action.payload;
    try {
        const response: AxiosResponse<IHoliday> = yield call(
            deleteHolidayApi,
            id,
            token
        );
        yield put(deleteHolidaySuccess(response.data));
    } catch (error: any) {
        yield put(deleteHolidayFailure(error.response.data.error));
    }
}

function* handleUpdateHoliday(action: any) {
    const { id, formData, token } = action.payload;
    try {
        const response: AxiosResponse<IHoliday> = yield call(
            updateHolidayApi,
            id,
            formData,
            token
        );
        yield put(updateHolidaySuccess(response.data));
    } catch (error: any) {
        yield put(updateHolidayFailure(error.response.data.error));
    }
}

function* handleCreateHoliday(action: any) {
    const { formData, token } = action.payload;
    try {
        const response: AxiosResponse<IHoliday> = yield call(
            createHolidayApi,
            formData,
            token
        );
        yield put(createHolidaySuccess(response.data));
    } catch (error: any) {
        yield put(createHolidayFailure(error.response.data.error));
    }
}

export default function* holidaySaga() {
    yield takeLatest(getAllHolidaysRequest.type, handleGetAllHolidays);
    yield takeLatest(createHolidayRequest.type, handleCreateHoliday);
    yield takeLatest(deleteHolidayRequest.type, handleDeleteHoliday);
    yield takeLatest(updateHolidayRequest.type, handleUpdateHoliday);
}
