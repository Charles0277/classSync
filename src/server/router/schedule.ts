import express from 'express';
import {
    deleteGlobalSchedule,
    generateGlobalSchedule,
    getGlobalSchedule,
    getUserSchedule
} from '../controllers/schedule.js';

export default (router: express.Router) => {
    router.post('/generate-global-schedule', generateGlobalSchedule);
    router.get('/get-global-schedule', getGlobalSchedule);
    router.get('/get-user-schedule/:id', getUserSchedule);
    router.delete('/delete-global-schedule', deleteGlobalSchedule);
};
