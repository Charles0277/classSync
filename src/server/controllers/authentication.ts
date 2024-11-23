import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { createUser, getUserByEmail } from '../services/user.services.js';

export const signUp = async (req: express.Request, res: express.Response) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            role,
            yearOfStudy,
            course,
            courseUnits
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword ||
            !role ||
            !yearOfStudy ||
            !course ||
            !courseUnits
        ) {
            return res.status(400).send({
                error: 'Please fill in all fields'
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
            password,
            role,
            yearOfStudy,
            course,
            courseUnits
        });

        return res.status(201).send(newUser);
    } catch (error) {
        return res.status(400).send(error);
    }
};

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body as {
            email: string;
            password: string;
        };

        if (!email || !password) {
            return res.status(400).send({
                error: 'Please provide an email and password'
            });
        }

        const existingUser = await getUserByEmail(email.toLowerCase());

        if (!existingUser) {
            return res.status(400).send({ error: 'This user does not exist' });
        }

        if (bcrypt.compareSync(password, existingUser.password)) {
        } else {
            return res.status(401).send({ error: 'Incorrect password' });
        }

        const payload = { userEmail: existingUser.email };
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET! as string, {
            expiresIn: '30d'
        });

        return res.status(201).send({ existingUser, token: jwtToken });
    } catch (error) {
        return res.status(400).send(error);
    }
};
