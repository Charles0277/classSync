import express from 'express';
import authentication from './authentication.js';
import classEntity from './class.js';
import course from './course.js';
import courseUnit from './courseUnit.js';
import room from './room.js';
import schedule from './schedule.js';
import schoolWeekConfig from './schoolWeekConfig.js';
import user from './user.js';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    user(router);
    room(router);
    schoolWeekConfig(router);
    course(router);
    courseUnit(router);
    classEntity(router);
    schedule(router);
    return router;
};
