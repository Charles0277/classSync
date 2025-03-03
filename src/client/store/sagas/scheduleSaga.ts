import {
    generateGlobalScheduleApi,
    getGlobalScheduleApi,
    getUserScheduleApi,
    updateGlobalScheduleApi
} from '@/client/api/scheduleApi';
import {
    IGlobalSchedule,
    IGlobalScheduleEntry,
    IUserScheduleEntry
} from '@/common/types/ISchedule';
import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
    generateGlobalScheduleFailure,
    generateGlobalScheduleRequest,
    generateGlobalScheduleSuccess,
    getGlobalScheduleFailure,
    getGlobalScheduleRequest,
    getGlobalScheduleSuccess,
    getUserScheduleFailure,
    getUserScheduleRequest,
    getUserScheduleSuccess,
    updateGlobalScheduleFailure,
    updateGlobalScheduleRequest,
    updateGlobalScheduleSuccess
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

function* updateGlobalSchedule(action: any) {
    const { token, id, formData } = action.payload;
    try {
        const response: AxiosResponse<IGlobalSchedule> = yield call(
            updateGlobalScheduleApi,
            token,
            id,
            formData
        );
        yield put(updateGlobalScheduleSuccess(response.data));
    } catch (error: any) {
        yield put(updateGlobalScheduleFailure(error.message));
    }
}

export default function* scheduleSaga() {
    yield takeLatest(getGlobalScheduleRequest.type, getGlobalSchedule);
    yield takeLatest(getUserScheduleRequest.type, getUserSchedule);
    yield takeLatest(
        generateGlobalScheduleRequest.type,
        generateGlobalSchedule
    );
    yield takeLatest(updateGlobalScheduleRequest.type, updateGlobalSchedule);
}
