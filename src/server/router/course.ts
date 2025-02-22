import express from 'express';
import {
    createNewCourse,
    deleteCourse,
    getAllCourses,
    getCourse,
    updateCourse
} from '../controllers/course.js';
import {
    authenticateToken,
    checkAdmin,
    checkTeacher
} from '../middleware/authMiddleware/index.js';

export default (router: express.Router) => {
    router.get('/courses', getAllCourses);
    router.get('/course/:id', authenticateToken, checkTeacher, getCourse);
    router.post(
        '/create-course',
        authenticateToken,
        checkAdmin,
        createNewCourse
    );
    router.delete(
        '/delete-course/:id',
        authenticateToken,
        checkAdmin,
        deleteCourse
    );
    router.put(
        '/update-course/:id',
        authenticateToken,
        checkAdmin,
        updateCourse
    );
};
