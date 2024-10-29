import express from 'express';
import authentication from './authentication.js';
import users from './users.js';
import rooms from './rooms.js';
import schoolWeekConfig from './schoolWeekConfig.js';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);
    rooms(router);
    schoolWeekConfig(router);
    return router;
};
