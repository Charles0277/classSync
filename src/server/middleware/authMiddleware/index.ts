import jwt from 'jsonwebtoken';
import express from 'express';

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
