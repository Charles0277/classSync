import express from 'express';
import {
    createNewClass,
    deleteClass,
    getAllClasses,
    getClass,
    updateClass
} from '../controllers/class.js';
import {
    authenticateToken,
    checkAdmin,
    checkTeacher
} from '../middleware/authMiddleware/index.ts';

export default (router: express.Router) => {
    router.get('/classes', authenticateToken, checkAdmin, getAllClasses);
    router.get('/class/:id', authenticateToken, getClass);
    router.post(
        '/create-class',
        authenticateToken,
        checkTeacher,
        createNewClass
    );
    router.delete(
        '/delete-class/:id',
        authenticateToken,
        checkAdmin,
        deleteClass
    );
    router.put(
        '/update-class/:id',
        authenticateToken,
        checkTeacher,
        updateClass
    );
};
