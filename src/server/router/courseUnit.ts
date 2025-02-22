import express from 'express';
import {
    createNewCourseUnit,
    deleteCourseUnit,
    getAllCourseUnits,
    getCourseUnit,
    updateCourseUnit
} from '../controllers/courseUnit.js';
import {
    authenticateToken,
    checkAdmin,
    checkTeacher
} from '../middleware/authMiddleware/index.js';

export default (router: express.Router) => {
    router.get('/course-units', getAllCourseUnits);
    router.get(
        '/course-unit/:id',
        authenticateToken,
        checkTeacher,
        getCourseUnit
    );
    router.post(
        '/create-course-unit',
        authenticateToken,
        checkAdmin,
        createNewCourseUnit
    );
    router.delete(
        '/delete-course-unit/:id',
        authenticateToken,
        checkAdmin,
        deleteCourseUnit
    );
    router.put(
        '/update-course-unit/:id',
        authenticateToken,
        checkAdmin,
        updateCourseUnit
    );
};
