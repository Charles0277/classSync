import express from 'express';
import {
    createNewHoliday,
    deleteHoliday,
    getAllHolidays,
    updateHoliday
} from '../controllers/holiday.ts';
import {
    authenticateToken,
    checkAdmin
} from '../middleware/authMiddleware/index.ts';

export default (router: express.Router) => {
    router.get('/holidays', authenticateToken, getAllHolidays);
    router.delete(
        '/delete-holiday/:id',
        authenticateToken,
        checkAdmin,
        deleteHoliday
    );
    router.put(
        '/update-holiday/:id',
        authenticateToken,
        checkAdmin,
        updateHoliday
    );
    router.post(
        '/create-holiday',
        authenticateToken,
        checkAdmin,
        createNewHoliday
    );
};
