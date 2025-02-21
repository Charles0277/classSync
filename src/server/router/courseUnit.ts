import express from 'express';
import {
    createNewCourseUnit,
    deleteCourseUnit,
    getAllCourseUnits,
    getCourseUnit,
    updateCourseUnit
} from '../controllers/courseUnit.js';
import { authenticateToken } from '../middleware/authMiddleware/index.js';

export default (router: express.Router) => {
    router.get('/course-units', getAllCourseUnits);
    router.get('/course-unit/:id', getCourseUnit);
    router.post('/create-course-unit', authenticateToken, createNewCourseUnit);
    router.delete(
        '/delete-course-unit/:id',
        authenticateToken,
        deleteCourseUnit
    );
    router.put('/update-course-unit/:id', authenticateToken, updateCourseUnit);
};
