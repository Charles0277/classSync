import { IDecodedToken } from '@/common/types/IDecodedToken.ts';
import express from 'express';
import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

export const authenticateToken = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
        return res.status(401).json({ msg: 'No token, authorization denied' });

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any) => {
        if (err) return res.status(403).json({ msg: 'Token is not valid' });
        next();
    });
};

export const checkAdmin = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('Unauthorized: No token provided');
    }

    const decoded: IDecodedToken = jwtDecode(token);

    if (decoded.userRole === 'admin') {
        next();
    } else {
        res.status(403).send('Forbidden: Admins only');
    }
};

export const checkTeacher = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('Unauthorized: No token provided');
    }

    const decoded: IDecodedToken = jwtDecode(token);

    if (decoded.userRole === 'teacher' || decoded.userRole === 'admin') {
        next();
    } else {
        res.status(403).send('Forbidden: Admins only');
    }
};
