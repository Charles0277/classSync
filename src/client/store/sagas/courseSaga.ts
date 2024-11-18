import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import {
    deleteCourseFailure,
    deleteCourseRequest,
    deleteCourseSuccess,
    fetchAllCoursesFailure,
    fetchAllCoursesRequest,
    fetchAllCoursesSuccess
} from '../slices/courseSlice';
import { deleteCourseApi, fetchCoursesApi } from '../../api/courseApi';
import { ICourse } from '../../../common/types/ICourse';

function* handleFetchAllCourses(action: any) {
    try {
        const response: AxiosResponse<ICourse[]> = yield call(fetchCoursesApi);
        yield put(fetchAllCoursesSuccess(response.data));
    } catch (error: any) {
        yield put(fetchAllCoursesFailure(error.message));
    }
}

function* handleDeleteCourse(action: any) {
    const { id, token } = action.payload;
    try {
        const response: AxiosResponse<ICourse> = yield call(
            deleteCourseApi,
            id,
            token
        );
        yield put(deleteCourseSuccess(response.data));
    } catch (error: any) {
        yield put(deleteCourseFailure(error.message));
    }
}

export default function* courseSaga() {
    yield takeLatest(fetchAllCoursesRequest.type, handleFetchAllCourses);
    yield takeLatest(deleteCourseRequest.type, handleDeleteCourse);
}
