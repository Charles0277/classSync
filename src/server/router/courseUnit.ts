import express from 'express';
import {
    authenticateToken,
    checkAdmin
} from '../middleware/authMiddleware/index.js';
import {
    createNewCourseUnit,
    deleteCourseUnit,
    getAllCourseUnits,
    getCourseUnit,
    updateCourseUnit
} from '../controllers/courseUnit.js';

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
