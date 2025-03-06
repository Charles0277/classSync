import express from 'express';
import {
    addGlobalScheduleEntry,
    checkScheduleConflict,
    deleteGlobalScheduleEntry,
    generateGlobalSchedule,
    getGlobalSchedule,
    getUserSchedule,
    updateGlobalScheduleEntry
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
    router.put(
        '/update-global-schedule/:id',
        authenticateToken,
        checkAdmin,
        updateGlobalScheduleEntry
    );
    router.delete(
        '/delete-global-schedule/:id',
        authenticateToken,
        checkAdmin,
        deleteGlobalScheduleEntry
    );
    router.put(
        '/add-global-schedule-entry',
        authenticateToken,
        checkAdmin,
        addGlobalScheduleEntry
    );
    router.post(
        '/check-for-conflicts',
        authenticateToken,
        checkAdmin,
        checkScheduleConflict
    );
};
