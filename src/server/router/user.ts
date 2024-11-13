import express from 'express';
import {
    deleteUser,
    getallUsers,
    getUser,
    updateUser
} from '../controllers/user.js';
import {
    authenticateToken,
    checkAdmin
} from '../middleware/authMiddleware/index.js';

export default (router: express.Router) => {
    router.get('/users', authenticateToken, getallUsers);
    router.get('/user/:email', getUser);
    router.delete('/delete-user/:id', authenticateToken, deleteUser);
    router.put('/update-user/:email', authenticateToken, updateUser);
};
