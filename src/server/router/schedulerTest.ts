import express from 'express';
import { generateSchedules } from '../scheduler/test.js';

export default (router: express.Router) => {
    router.post('/generate-schedules', generateSchedules);
};
