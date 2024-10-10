import express from 'express';
import bcrypt from 'bcrypt';

import { createUser, getUserByEmail } from '../services/user.services.js';

export const signUp = async (req: express.Request, res: express.Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
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
            password
        });

        return res.status(201).send(newUser);
    } catch (error) {
        return res.status(400).send(error);
    }
};

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                error: 'Please provide an email and password'
            });
        }

        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            return res.status(400).send({ error: 'This user does not exist' });
        }

        if (bcrypt.compareSync(password, existingUser.password)) {
        } else {
            return res.status(403).send({ error: 'Incorrect password' });
        }

        return res.status(201).send(existingUser);
    } catch (error) {
        return res.status(400).send(error);
    }
};
