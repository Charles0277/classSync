import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import {
    fetchAllCoursesFailure,
    fetchAllCoursesRequest,
    fetchAllCoursesSuccess
} from '../slices/courseSlice';
import { fetchCoursesApi } from '../../api/courseApi';
import { ICourse } from '../../../common/types/ICourse';

function* handleFetchAllCourses(action: any) {
    try {
        const response: AxiosResponse<ICourse[]> = yield call(fetchCoursesApi);
        yield put(fetchAllCoursesSuccess(response.data));
    } catch (error: any) {
        yield put(fetchAllCoursesFailure(error.message));
    }
}

export default function* courseSaga() {
    yield takeLatest(fetchAllCoursesRequest.type, handleFetchAllCourses);
}
