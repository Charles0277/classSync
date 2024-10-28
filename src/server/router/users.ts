import express from 'express';
import {
    deleteUser,
    getallUsers,
    getUser,
    updateUser
} from '../controllers/users.js';
import {
    authenticateToken,
    checkAdmin
} from '../middleware/authMiddleware/index.js';

export default (router: express.Router) => {
    router.get('/users', authenticateToken, checkAdmin, getallUsers);
    router.get('/user/:email', getUser);
    router.delete(
        '/delete-user/:id',
        authenticateToken,
        checkAdmin,
        deleteUser
    );
    router.put('/update-user/:id', authenticateToken, checkAdmin, updateUser);
};
