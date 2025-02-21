import express from 'express';
import {
    deleteUser,
    getAllTeachers,
    getAllUsers,
    getUser,
    getUsers,
    updateUser
} from '../controllers/user.js';
import {
    authenticateToken,
    checkTeacher
} from '../middleware/authMiddleware/index.js';

export default (router: express.Router) => {
    router.get('/all-users', authenticateToken, getAllUsers);
    router.get('/users', authenticateToken, checkTeacher, getUsers);
    router.get('/all-teachers', authenticateToken, getAllTeachers);
    router.get('/user/:email', getUser);
    router.delete('/delete-user/:id', authenticateToken, deleteUser);
    router.put('/update-user/:id', authenticateToken, updateUser);
};
