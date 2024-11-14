import express from 'express';
import {
    authenticateToken,
    checkAdmin
} from '../middleware/authMiddleware/index.js';
import {
    createNewCourseUnit,
    deleteCourseUnit,
    updateCourseUnit
} from '../controllers/courseUnit.js';

export default (router: express.Router) => {
    // router.get('/courses', getAllCourses);
    // router.get('/course-unit/:code', getCourseUnit);
    router.post('/create-course-unit', authenticateToken, createNewCourseUnit);
    router.delete(
        '/delete-course-unit/:code',
        authenticateToken,
        checkAdmin,
        deleteCourseUnit
    );
    router.put(
        '/update-course-unit/:code',
        authenticateToken,
        checkAdmin,
        updateCourseUnit
    );
};
