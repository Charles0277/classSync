import express from 'express';
import {
    authenticateToken,
    checkAdmin
} from '../middleware/authMiddleware/index.js';
import {
    createSchoolWeekConfig,
    getSchoolWeekConfig,
    updateSchoolWeekConfig
} from '../controllers/schoolWeekConfig.js';

export default (router: express.Router) => {
    router.get(
        '/school-week-config',
        authenticateToken,
        // checkAdmin,
        getSchoolWeekConfig
    );
    router.post(
        '/create-school-week-config',
        authenticateToken,
        // checkAdmin,
        createSchoolWeekConfig
    );
    router.post(
        '/update-school-week-config',
        authenticateToken,
        // checkAdmin,
        updateSchoolWeekConfig
    );
};
