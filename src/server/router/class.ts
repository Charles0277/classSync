import express from 'express';
import {
    createNewClass,
    deleteClass,
    getAllClasses,
    getClass,
    updateClass
} from '../controllers/class.js';

export default (router: express.Router) => {
    router.get('/classes', getAllClasses);
    router.get('/class/:id', getClass);
    router.post('/create-class', createNewClass);
    router.delete('/delete-class/:id', deleteClass);
    router.put('/update-class/:id', updateClass);
};
