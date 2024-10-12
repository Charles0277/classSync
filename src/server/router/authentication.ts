import express from 'express';

import {
    checkOrCreateUser,
    login,
    signUp
} from '../controllers/authentication.js';
import { checkJwt } from '../middleware/authMiddleware.js';

export default (router: express.Router) => {
    router.post('/auth/signup', signUp);
    router.post('/auth/login', login);
    router.post('/auth/check-or-create-user', checkJwt, checkOrCreateUser);
};
