import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { ISchoolWeekConfig } from '../../../common/types/ISchoolWeekConfig';
import {
    getConfigFailure,
    getConfigRequest,
    getConfigSuccess,
    updateConfigFailure,
    updateConfigRequest,
    updateConfigSuccess
} from '../slices/schoolWeekConfigSlice';
import { getConfigApi, updateConfigApi } from '../../api/schoolWeekConfigApi';

function* fetchSchoolWeekConfig(action: any) {
    const { token } = action.payload;
    try {
        const response: AxiosResponse<ISchoolWeekConfig> = yield call(
            getConfigApi,
            token
        );
        yield put(getConfigSuccess(response.data));
    } catch (error: any) {
        yield put(getConfigFailure(error.message));
    }
}

function* updateSchoolWeekConfig(action: any) {
    const { token, updatedConfig } = action.payload;
    try {
        const response: AxiosResponse<any> = yield call(
            updateConfigApi,
            token,
            updatedConfig
        );
        yield put(updateConfigSuccess(response.data.data));
    } catch (error: any) {
        yield put(updateConfigFailure(error.message));
    }
}

export default function* schoolWeekConfigSaga() {
    yield takeLatest(getConfigRequest.type, fetchSchoolWeekConfig);
    yield takeLatest(updateConfigRequest.type, updateSchoolWeekConfig);
}
