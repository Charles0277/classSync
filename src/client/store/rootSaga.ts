import { all, fork } from 'redux-saga/effects';
import authSaga from './sagas/authSaga';
import classSaga from './sagas/classSaga';
import courseSaga from './sagas/courseSaga';
import courseUnitSaga from './sagas/courseUnitSaga';
import feedbackSaga from './sagas/feedbackSaga';
import holidaySaga from './sagas/holidaySaga';
import roomSaga from './sagas/roomSaga';
import scheduleSaga from './sagas/scheduleSaga';
import userSaga from './sagas/userSaga';

export default function* rootSaga() {
    yield all([
        fork(userSaga),
        fork(authSaga),
        fork(roomSaga),
        fork(courseSaga),
        fork(courseUnitSaga),
        fork(scheduleSaga),
        fork(classSaga),
        fork(feedbackSaga),
        fork(holidaySaga)
    ]);
}
