import express from 'express';
import {
    deleteUser,
    getallUsers,
    getUser,
    updateUser
} from '../controllers/users.js';
import { authenticateToken } from '../middleware/authMiddleware/index.js';

export default (router: express.Router) => {
    router.get('/users', authenticateToken, getallUsers);
    router.get('/user/:email', getUser);
    router.delete('/deleteuser/:id', authenticateToken, deleteUser);
    router.put('/updateuser/:id', authenticateToken, updateUser);
};
