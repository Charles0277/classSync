import { all, fork } from 'redux-saga/effects';
import userSaga from './sagas/userSaga';
import authSaga from './sagas/authSaga';

export default function* rootSaga() {
    yield all([fork(userSaga), fork(authSaga)]);
}
