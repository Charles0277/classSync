import express from 'express';
import {
    createNewClass,
    deleteClass,
    getAllClasses,
    getClass,
    updateClass
} from '../controllers/class.js';
import { checkTeacher } from '../middleware/authMiddleware/index.ts';

export default (router: express.Router) => {
    router.get('/classes', getAllClasses);
    router.get('/class/:id', getClass);
    router.post('/create-class', createNewClass);
    router.delete('/delete-class/:id', deleteClass);
    router.put('/update-class/:id', checkTeacher, updateClass);
};
