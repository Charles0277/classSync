import {
    deleteGlobalScheduleEntryApi,
    generateGlobalScheduleApi,
    getGlobalScheduleApi,
    getUserScheduleApi,
    updateGlobalScheduleEntryApi
} from '@/client/api/scheduleApi';
import {
    IGlobalSchedule,
    IGlobalScheduleEntry,
    IUserScheduleEntry
} from '@/common/types/ISchedule';
import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
    deleteGlobalScheduleEntryFailure,
    deleteGlobalScheduleEntryRequest,
    deleteGlobalScheduleEntrySuccess,
    generateGlobalScheduleFailure,
    generateGlobalScheduleRequest,
    generateGlobalScheduleSuccess,
    getGlobalScheduleFailure,
    getGlobalScheduleRequest,
    getGlobalScheduleSuccess,
    getUserScheduleFailure,
    getUserScheduleRequest,
    getUserScheduleSuccess,
    updateGlobalScheduleEntryFailure,
    updateGlobalScheduleEntryRequest,
    updateGlobalScheduleEntrySuccess
} from '../slices/scheduleSlice';

function* getGlobalSchedule(action: any) {
    const { token } = action.payload;
    try {
        const response: AxiosResponse<IGlobalScheduleEntry[]> = yield call(
            getGlobalScheduleApi,
            token
        );
        yield put(getGlobalScheduleSuccess(response.data));
    } catch (error: any) {
        yield put(getGlobalScheduleFailure(error.message));
    }
}

function* getUserSchedule(action: any) {
    const { token, id, role } = action.payload;
    try {
        const response: AxiosResponse<IUserScheduleEntry[]> = yield call(
            getUserScheduleApi,
            token,
            id,
            role
        );
        yield put(getUserScheduleSuccess(response.data));
    } catch (error: any) {
        yield put(getUserScheduleFailure(error.message));
    }
}

function* generateGlobalSchedule(action: any) {
    const { token, semester } = action.payload;
    try {
        const response: AxiosResponse<IGlobalSchedule> = yield call(
            generateGlobalScheduleApi,
            token,
            semester
        );
        yield put(generateGlobalScheduleSuccess(response.data));
    } catch (error: any) {
        yield put(generateGlobalScheduleFailure(error.message));
    }
}

function* updateGlobalScheduleEntry(action: any) {
    const { token, id, formData } = action.payload;
    try {
        const response: AxiosResponse<IGlobalScheduleEntry> = yield call(
            updateGlobalScheduleEntryApi,
            token,
            id,
            formData
        );
        yield put(updateGlobalScheduleEntrySuccess(response.data));
    } catch (error: any) {
        yield put(updateGlobalScheduleEntryFailure(error.message));
    }
}

function* deleteGlobalScheduleEntry(action: any) {
    const { token, id } = action.payload;
    try {
        const response: AxiosResponse<IGlobalScheduleEntry> = yield call(
            deleteGlobalScheduleEntryApi,
            token,
            id
        );
        yield put(deleteGlobalScheduleEntrySuccess(response.data));
    } catch (error: any) {
        yield put(deleteGlobalScheduleEntryFailure(error.message));
    }
}

export default function* scheduleSaga() {
    yield takeLatest(getGlobalScheduleRequest.type, getGlobalSchedule);
    yield takeLatest(getUserScheduleRequest.type, getUserSchedule);
    yield takeLatest(
        generateGlobalScheduleRequest.type,
        generateGlobalSchedule
    );
    yield takeLatest(
        updateGlobalScheduleEntryRequest.type,
        updateGlobalScheduleEntry
    );
    yield takeLatest(
        deleteGlobalScheduleEntryRequest.type,
        deleteGlobalScheduleEntry
    );
}
