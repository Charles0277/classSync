import {
    deleteClassApi,
    getClassApi,
    updateClassApi
} from '@/client/api/classApi';
import { IClass } from '@/common/types/IClass';
import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
    deleteClassFailure,
    deleteClassRequest,
    deleteClassSuccess,
    getClassFailure,
    getClassRequest,
    getClassSuccess,
    updateClassFailure,
    updateClassRequest,
    updateClassSuccess
} from '../slices/classSlice';

function* fetchClass(action: any) {
    const { token, id } = action.payload;
    try {
        const response: AxiosResponse<IClass> = yield call(
            getClassApi,
            token,
            id
        );
        yield put(getClassSuccess(response.data));
    } catch (error: any) {
        yield put(getClassFailure(error.message));
    }
}

function* updateClass(action: any) {
    const { token, id, formData } = action.payload;
    try {
        const response: AxiosResponse<IClass> = yield call(
            updateClassApi,
            token,
            id,
            formData
        );
        yield put(updateClassSuccess(response.data));
    } catch (error: any) {
        yield put(updateClassFailure(error.message));
    }
}

function* deleteClass(action: any) {
    const { token, id } = action.payload;
    try {
        const response: AxiosResponse<IClass> = yield call(
            deleteClassApi,
            token,
            id
        );
        yield put(deleteClassSuccess(response.data));
    } catch (error: any) {
        yield put(deleteClassFailure(error.message));
    }
}
export default function* classSaga() {
    yield takeLatest(getClassRequest.type, fetchClass);
    yield takeLatest(updateClassRequest.type, updateClass);
    yield takeLatest(deleteClassRequest.type, deleteClass);
}
