import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { ICourseUnit } from '../../../common/types/ICourseUnit.js';
import {
    createCourseUnitApi,
    deleteCourseUnitApi,
    fetchCourseUnitsApi,
    updateCourseUnitApi
} from '../../api/courseUnitApi.js';
import {
    createCourseUnitFailure,
    createCourseUnitRequest,
    createCourseUnitSuccess,
    deleteCourseUnitFailure,
    deleteCourseUnitRequest,
    deleteCourseUnitSuccess,
    fetchAllCourseUnitsFailure,
    fetchAllCourseUnitsRequest,
    fetchAllCourseUnitsSuccess,
    updateCourseUnitFailure,
    updateCourseUnitRequest,
    updateCourseUnitSuccess
} from '../slices/courseUnitSlice.js';

function* handleFetchAllCourseUnits(action: any) {
    try {
        const response: AxiosResponse<ICourseUnit[]> =
            yield call(fetchCourseUnitsApi);
        yield put(fetchAllCourseUnitsSuccess(response.data));
    } catch (error: any) {
        yield put(fetchAllCourseUnitsFailure(error.response.data.error));
    }
}

function* handleDeleteCourseUnit(action: any) {
    const { id, token } = action.payload;
    try {
        const response: AxiosResponse<ICourseUnit> = yield call(
            deleteCourseUnitApi,
            id,
            token
        );
        yield put(deleteCourseUnitSuccess(response.data));
    } catch (error: any) {
        yield put(deleteCourseUnitFailure(error.response.data.error));
    }
}

function* handleUpdateCourseUnit(action: any) {
    const { id, formData, token } = action.payload;
    try {
        const response: AxiosResponse<ICourseUnit> = yield call(
            updateCourseUnitApi,
            id,
            formData,
            token
        );
        yield put(updateCourseUnitSuccess(response.data));
    } catch (error: any) {
        yield put(updateCourseUnitFailure(error.response.data.error));
    }
}

function* handleCreateCourseUnit(action: any) {
    const { formData, token } = action.payload;
    try {
        const response: AxiosResponse<ICourseUnit> = yield call(
            createCourseUnitApi,
            formData,
            token
        );
        yield put(createCourseUnitSuccess(response.data));
    } catch (error: any) {
        yield put(createCourseUnitFailure(error.response.data.error));
    }
}

export default function* courseUnitSaga() {
    yield takeLatest(
        fetchAllCourseUnitsRequest.type,
        handleFetchAllCourseUnits
    );
    yield takeLatest(deleteCourseUnitRequest.type, handleDeleteCourseUnit);
    yield takeLatest(updateCourseUnitRequest.type, handleUpdateCourseUnit);
    yield takeLatest(createCourseUnitRequest.type, handleCreateCourseUnit);
}
