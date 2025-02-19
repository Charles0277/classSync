import {
    generateGlobalScheduleApi,
    getGlobalScheduleApi,
    getUserScheduleApi
} from '@/client/api/scheduleApi';
import {
    IGlobalSchedule,
    IIndividualScheduleEntry
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
    getUserScheduleSuccess
} from '../slices/scheduleSlice';

function* getGlobalSchedule(action: any) {
    const { token } = action.payload;
    try {
        const response: AxiosResponse<IGlobalSchedule> = yield call(
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
        const response: AxiosResponse<IIndividualScheduleEntry> = yield call(
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

export default function* scheduleSaga() {
    yield takeLatest(getGlobalScheduleRequest.type, getGlobalSchedule);
    yield takeLatest(getUserScheduleRequest.type, getUserSchedule);
    yield takeLatest(
        generateGlobalScheduleRequest.type,
        generateGlobalSchedule
    );
}
