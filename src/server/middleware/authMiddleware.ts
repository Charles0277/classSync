import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import dotenv from 'dotenv';
import express from 'express';
import { IUser } from '../../common/types/IUser.js';

dotenv.config();

export const checkJwt = expressjwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://dev-fysr0p33y7g0ih1i.us.auth0.com/.well-known/jwks.json`
    }) as jwksRsa.GetVerificationKey,
    audience: 'https://dev-fysr0p33y7g0ih1i.us.auth0.com/api/v2/',
    issuer: `https://dev-fysr0p33y7g0ih1i.us.auth0.com/`,
    algorithms: ['RS256']
});
