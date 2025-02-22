import { IDecodedToken } from '@/common/types/IDecodedToken.ts';
import express from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorisation denied' });
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        (err: any, decoded: any) => {
            if (err) {
                return res.status(403).json({ msg: 'Token is not valid' });
            }

            req.user = decoded as IDecodedToken; // Attach verified token payload
            next();
        }
    );
};

export const checkAdmin = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    if (!req.user) {
        return res.status(401).send('Unauthorised: No token provided');
    }

    if (req.user.userRole === 'admin') {
        next();
    } else {
        res.status(403).send('Forbidden: Admins only');
    }
};

export const checkTeacher = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    if (!req.user) {
        return res.status(401).send('Unauthorised: No token provided');
    }

    if (req.user.userRole === 'teacher' || req.user.userRole === 'admin') {
        next();
    } else {
        res.status(403).send('Forbidden: Teachers and Admins only');
    }
};
