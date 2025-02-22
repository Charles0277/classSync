import express from 'express';
import {
    deleteGlobalSchedule,
    generateGlobalSchedule,
    getGlobalSchedule,
    getUserSchedule
} from '../controllers/schedule.js';
import { checkAdmin } from '../middleware/authMiddleware/index.ts';

export default (router: express.Router) => {
    router.post(
        '/generate-global-schedule',
        checkAdmin,
        generateGlobalSchedule
    );
    router.get('/get-global-schedule', checkAdmin, getGlobalSchedule);
    router.get('/get-user-schedule/:id', getUserSchedule);
    router.delete('/delete-global-schedule', checkAdmin, deleteGlobalSchedule);
};
