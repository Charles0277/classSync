import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import {
    createCourseFailure,
    createCourseRequest,
    createCourseSuccess,
    deleteCourseFailure,
    deleteCourseRequest,
    deleteCourseSuccess,
    fetchAllCoursesFailure,
    fetchAllCoursesRequest,
    fetchAllCoursesSuccess,
    updateCourseFailure,
    updateCourseRequest,
    updateCourseSuccess
} from '../slices/courseSlice';
import {
    createCourseApi,
    deleteCourseApi,
    fetchCoursesApi,
    updateCourseApi
} from '../../api/courseApi';
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

function* handleUpdateCourse(action: any) {
    const { id, formData, token } = action.payload;
    try {
        const response: AxiosResponse<ICourse> = yield call(
            updateCourseApi,
            id,
            formData,
            token
        );
        yield put(updateCourseSuccess(response.data));
    } catch (error: any) {
        yield put(updateCourseFailure(error.message));
    }
}

function* handleCreateCourse(action: any) {
    const { formData, token } = action.payload;
    try {
        const response: AxiosResponse<ICourse> = yield call(
            createCourseApi,
            formData,
            token
        );
        yield put(createCourseSuccess(response.data));
    } catch (error: any) {
        yield put(createCourseFailure(error.message));
    }
}

export default function* courseSaga() {
    yield takeLatest(fetchAllCoursesRequest.type, handleFetchAllCourses);
    yield takeLatest(deleteCourseRequest.type, handleDeleteCourse);
    yield takeLatest(updateCourseRequest.type, handleUpdateCourse);
    yield takeLatest(createCourseRequest.type, handleCreateCourse);
}
