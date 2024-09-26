import express from 'express';
import { deleteUser, getallUsers, updateUser } from '../controllers/users.js';

export default (router: express.Router) => {
    router.get('/users', getallUsers);
    router.delete('/deleteuser/:id', deleteUser);
    router.put('/updateuser/:id', updateUser);
};
