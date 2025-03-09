import {
    addGlobalScheduleEntryApi,
    checkForConflictsApi,
    deleteGlobalScheduleEntryApi,
    generateGlobalScheduleApi,
    getFriendsScheduleApi,
    getGlobalScheduleApi,
    getUserScheduleApi,
    updateGlobalScheduleEntryApi
} from '@/client/api/scheduleApi';
import {
    IFriendsScheduleEntry,
    IGlobalSchedule,
    IGlobalScheduleEntry,
    IUserScheduleEntry
} from '@/common/types/ISchedule';
import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
    addGlobalScheduleEntryFailure,
    addGlobalScheduleEntryRequest,
    addGlobalScheduleEntrySuccess,
    checkForConflictsFailure,
    checkForConflictsRequest,
    checkForConflictsSuccess,
    deleteGlobalScheduleEntryFailure,
    deleteGlobalScheduleEntryRequest,
    deleteGlobalScheduleEntrySuccess,
    generateGlobalScheduleFailure,
    generateGlobalScheduleRequest,
    generateGlobalScheduleSuccess,
    getFriendsScheduleFailure,
    getFriendsScheduleRequest,
    getFriendsScheduleSuccess,
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

function* addGlobalScheduleEntry(action: any) {
    const { token, formData } = action.payload;
    try {
        const response: AxiosResponse<IGlobalScheduleEntry> = yield call(
            addGlobalScheduleEntryApi,
            token,
            formData
        );
        yield put(addGlobalScheduleEntrySuccess(response.data));
    } catch (error: any) {
        yield put(addGlobalScheduleEntryFailure(error.message));
    }
}

function* checkForConflicts(action: any) {
    const { token, formData } = action.payload;
    try {
        const response: AxiosResponse<IGlobalScheduleEntry[]> = yield call(
            checkForConflictsApi,
            token,
            formData
        );
        yield put(checkForConflictsSuccess(response.data));
    } catch (error: any) {
        yield put(checkForConflictsFailure(error.message));
    }
}

function* getFriendsSchedule(action: any) {
    const { token, friendIds } = action.payload;
    try {
        const response: AxiosResponse<IFriendsScheduleEntry[]> = yield call(
            getFriendsScheduleApi,
            token,
            friendIds
        );
        yield put(getFriendsScheduleSuccess(response.data));
    } catch (error: any) {
        yield put(getFriendsScheduleFailure(error.message));
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
    yield takeLatest(
        addGlobalScheduleEntryRequest.type,
        addGlobalScheduleEntry
    );
    yield takeLatest(checkForConflictsRequest.type, checkForConflicts);
    yield takeLatest(getFriendsScheduleRequest.type, getFriendsSchedule);
}
