import {
    createFeedbackApi,
    deleteFeedbackApi,
    getAllFeedbackApi,
    getUserFeedbackApi,
    updateFeedbackApi
} from '@/client/api/feedbackApi';
import { IFeedback } from '@/common/types/IFeedback';
import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
    createFeedbackFailure,
    createFeedbackRequest,
    createFeedbackSuccess,
    deleteFeedbackFailure,
    deleteFeedbackRequest,
    deleteFeedbackSuccess,
    getAllFeedbackFailure,
    getAllFeedbackRequest,
    getAllFeedbackSuccess,
    getUserFeedbackFailure,
    getUserFeedbackRequest,
    getUserFeedbackSuccess,
    updateFeedbackFailure,
    updateFeedbackRequest,
    updateFeedbackSuccess
} from '../slices/feedbackSlice';

function* handleGetAllFeedback(action: any) {
    const { token } = action.payload;

    try {
        const response: AxiosResponse<IFeedback[]> = yield call(
            getAllFeedbackApi,
            token
        );
        yield put(getAllFeedbackSuccess(response.data));
    } catch (error: any) {
        yield put(getAllFeedbackFailure(error.message));
    }
}

function* handleGetUserFeedback(action: any) {
    const { token, userId } = action.payload;

    try {
        const response: AxiosResponse<IFeedback[]> = yield call(
            getUserFeedbackApi,
            token,
            userId
        );
        yield put(getUserFeedbackSuccess(response.data));
    } catch (error: any) {
        yield put(getUserFeedbackFailure(error.message));
    }
}

function* handleDeleteFeedback(action: any) {
    const { id, token } = action.payload;
    try {
        const response: AxiosResponse<IFeedback> = yield call(
            deleteFeedbackApi,
            id,
            token
        );
        yield put(deleteFeedbackSuccess(response.data));
    } catch (error: any) {
        yield put(deleteFeedbackFailure(error.message));
    }
}

function* handleUpdateFeedback(action: any) {
    const { id, formData, token } = action.payload;
    try {
        const response: AxiosResponse<IFeedback> = yield call(
            updateFeedbackApi,
            id,
            formData,
            token
        );
        yield put(updateFeedbackSuccess(response.data));
    } catch (error: any) {
        yield put(updateFeedbackFailure(error.message));
    }
}

function* handleCreateFeedback(action: any) {
    const { formData, token } = action.payload;
    try {
        const response: AxiosResponse<IFeedback> = yield call(
            createFeedbackApi,
            formData,
            token
        );
        yield put(createFeedbackSuccess(response.data));
    } catch (error: any) {
        yield put(createFeedbackFailure(error.message));
    }
}

export default function* feedbackSaga() {
    yield takeLatest(getAllFeedbackRequest.type, handleGetAllFeedback);
    yield takeLatest(getUserFeedbackRequest.type, handleGetUserFeedback);
    yield takeLatest(deleteFeedbackRequest.type, handleDeleteFeedback);
    yield takeLatest(updateFeedbackRequest.type, handleUpdateFeedback);
    yield takeLatest(createFeedbackRequest.type, handleCreateFeedback);
}
