import { all, fork } from 'redux-saga/effects';
import authSaga from './sagas/authSaga';
import courseSaga from './sagas/courseSaga';
import courseUnitSaga from './sagas/courseUnitSaga';
import roomSaga from './sagas/roomSaga';
import scheduleSaga from './sagas/scheduleSaga';
import schoolWeekConfigSaga from './sagas/schoolWeekConfigSaga';
import userSaga from './sagas/userSaga';

export default function* rootSaga() {
    yield all([
        fork(userSaga),
        fork(authSaga),
        fork(schoolWeekConfigSaga),
        fork(roomSaga),
        fork(courseSaga),
        fork(courseUnitSaga),
        fork(scheduleSaga)
    ]);
}
