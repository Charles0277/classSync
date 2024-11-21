import express from 'express';
import {
    createNewCourse,
    deleteCourse,
    getAllCourses,
    getCourse,
    updateCourse
} from '../controllers/course.js';
import { authenticateToken } from '../middleware/authMiddleware/index.js';

export default (router: express.Router) => {
    router.get('/courses', getAllCourses);
    router.get('/course/:id', getCourse);
    router.post('/create-course', authenticateToken, createNewCourse);
    router.delete('/delete-course/:id', authenticateToken, deleteCourse);
    router.put('/update-course/:id', authenticateToken, updateCourse);
};
