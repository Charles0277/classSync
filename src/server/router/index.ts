import express from 'express';
import authentication from './authentication.js';
import classEntity from './class.js';
import course from './course.js';
import courseUnit from './courseUnit.js';
import feedback from './feedback.ts';
import holiday from './holiday.ts';
import room from './room.js';
import schedule from './schedule.js';
import user from './user.js';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    user(router);
    room(router);
    course(router);
    courseUnit(router);
    classEntity(router);
    schedule(router);
    feedback(router);
    holiday(router);
    return router;
};
