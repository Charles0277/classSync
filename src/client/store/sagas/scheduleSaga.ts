import {
    getGlobalScheduleApi,
    getUserScheduleApi
} from '@/client/api/scheduleApi';
import { IGlobalSchedule, IIndividualSchedule } from '@/common/types/ISchedule';
import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
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
    const { token, id } = action.payload;
    try {
        const response: AxiosResponse<IIndividualSchedule> = yield call(
            getUserScheduleApi,
            token,
            id
        );
        yield put(getUserScheduleSuccess(response.data));
    } catch (error: any) {
        yield put(getUserScheduleFailure(error.message));
    }
}

export default function* scheduleSaga() {
    yield takeLatest(getGlobalScheduleRequest.type, getGlobalSchedule);
    yield takeLatest(getUserScheduleRequest.type, getUserSchedule);
}
