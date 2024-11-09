import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { IRoom } from '../../../common/types/IRoom';
import {
    fetchAllCoursesFailure,
    fetchAllCoursesRequest,
    fetchAllCoursesSuccess
} from '../slices/courseSlice';
import { fetchCoursesApi } from '../../api/courseApi';

function* handleFetchAllCourses(action: any) {
    const { token } = action.payload;

    try {
        const response: AxiosResponse<IRoom[]> = yield call(
            fetchCoursesApi,
            token
        );
        yield put(fetchAllCoursesSuccess(response.data));
    } catch (error: any) {
        yield put(fetchAllCoursesFailure(error.message));
    }
}

export default function* courseSaga() {
    yield takeLatest(fetchAllCoursesRequest.type, handleFetchAllCourses);
}
