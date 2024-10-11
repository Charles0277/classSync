import express from 'express';
import { deleteUser, getallUsers, updateUser } from '../controllers/users.js';
import { checkJwt } from '../middleware/authMiddleware.js';

export default (router: express.Router) => {
    router.get('/users', checkJwt, getallUsers);
    router.delete('/deleteuser/:id', checkJwt, deleteUser);
    router.put('/updateuser/:id', checkJwt, updateUser);
};
