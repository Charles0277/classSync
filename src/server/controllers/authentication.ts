import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { createUser, getUserByEmail } from '../services/user.services.js';

export const signUp = async (req: express.Request, res: express.Response) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } =
            req.body;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            return res.status(400).send({
                error: 'Please provide a first name, last name, email and password'
            });
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(400).send({ error: 'User already exists' });
        }

        const newUser = await createUser({
            firstName,
            lastName,
            email,
            authentication: {
                password
            }
        });

        return res.status(201).send(newUser);
    } catch (error) {
        return res.status(400).send(error);
    }
};

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        console.log('🚀 ~ login ~ password:', password);
        console.log('🚀 ~ login ~ email:', email);

        if (!email || !password) {
            return res.status(400).send({
                error: 'Please provide an email and password'
            });
        }

        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            return res.status(400).send({ error: 'This user does not exist' });
        }

        if (
            bcrypt.compareSync(password, existingUser.authentication.password)
        ) {
        } else {
            return res.status(403).send({ error: 'Incorrect password' });
        }

        const jwtToken = jwt.sign(
            {
                expiry: 3600,
                email: existingUser.email
            },
            process.env.JWT_SECRET!
        );

        return res.status(201).send({ existingUser, token: jwtToken });
    } catch (error) {
        return res.status(400).send(error);
    }
};
