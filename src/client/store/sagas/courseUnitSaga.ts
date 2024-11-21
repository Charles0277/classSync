import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';

import {
    deleteCourseUnitFailure,
    deleteCourseUnitRequest,
    deleteCourseUnitSuccess,
    fetchAllCourseUnitsFailure,
    fetchAllCourseUnitsRequest,
    fetchAllCourseUnitsSuccess
} from '../slices/courseUnitSlice.js';
import { ICourseUnit } from '../../../common/types/ICourseUnit.js';
import { fetchCourseUnitsApi } from '../../api/courseUnitApi.js';

function* handleFetchAllCourseUnits(action: any) {
    try {
        const response: AxiosResponse<ICourseUnit[]> =
            yield call(fetchCourseUnitsApi);
        yield put(fetchAllCourseUnitsSuccess(response.data));
    } catch (error: any) {
        yield put(fetchAllCourseUnitsFailure(error.message));
    }
}

function* handleDeleteCourseUnit(action: any) {
    const { id, token } = action.payload;
    try {
        const response: AxiosResponse<ICourseUnit> = yield call(
            // deleteCourseUnitApi,
            id,
            token
        );
        yield put(deleteCourseUnitSuccess(response.data));
    } catch (error: any) {
        yield put(deleteCourseUnitFailure(error.message));
    }
}

export default function* courseUnitSaga() {
    yield takeLatest(
        fetchAllCourseUnitsRequest.type,
        handleFetchAllCourseUnits
    );
    yield takeLatest(deleteCourseUnitRequest.type, handleDeleteCourseUnit);
}
