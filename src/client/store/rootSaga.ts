import { all, fork } from 'redux-saga/effects';
import userSaga from './sagas/userSaga';
import authSaga from './sagas/authSaga';
import schoolWeekConfigSaga from './sagas/schoolWeekConfigSaga';
import roomSaga from './sagas/roomSaga';
import courseSaga from './sagas/courseSaga';

export default function* rootSaga() {
    yield all([
        fork(userSaga),
        fork(authSaga),
        fork(schoolWeekConfigSaga),
        fork(roomSaga),
        fork(courseSaga)
    ]);
}
