import express from 'express';
import {
    deleteUser,
    getAllTeachers,
    getAllUsers,
    getUser,
    updateUser
} from '../controllers/user.js';
import { authenticateToken } from '../middleware/authMiddleware/index.js';

export default (router: express.Router) => {
    router.get('/users', authenticateToken, getAllUsers);
    router.get('/teachers', authenticateToken, getAllTeachers);
    router.get('/user/:email', getUser);
    router.delete('/delete-user/:id', authenticateToken, deleteUser);
    router.put('/update-user/:id', authenticateToken, updateUser);
};
