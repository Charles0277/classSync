import express from 'express';
import authentication from './authentication.js';
import user from './user.js';
import room from './room.js';
import schoolWeekConfig from './schoolWeekConfig.js';
import course from './course.js';
import courseUnit from './courseUnit.js';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    user(router);
    room(router);
    schoolWeekConfig(router);
    course(router);
    courseUnit(router);
    return router;
};
