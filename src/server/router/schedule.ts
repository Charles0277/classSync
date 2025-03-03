import express from 'express';
import {
    deleteGlobalSchedule,
    generateGlobalSchedule,
    getGlobalSchedule,
    getUserSchedule,
    updateGlobalSchedule
} from '../controllers/schedule.js';
import {
    authenticateToken,
    checkAdmin
} from '../middleware/authMiddleware/index.ts';

export default (router: express.Router) => {
    router.post(
        '/generate-global-schedule',
        authenticateToken,
        checkAdmin,
        generateGlobalSchedule
    );
    router.get(
        '/get-global-schedule',
        authenticateToken,
        checkAdmin,
        getGlobalSchedule
    );
    router.get('/get-user-schedule/:id', authenticateToken, getUserSchedule);
    router.delete(
        '/delete-global-schedule',
        authenticateToken,
        checkAdmin,
        deleteGlobalSchedule
    );
    router.put(
        '/update-global-schedule/:id',
        authenticateToken,
        checkAdmin,
        updateGlobalSchedule
    );
};
