import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';

import {
    MANCHESTER_EMAIL_ERROR,
    MANCHESTER_EMAIL_REGEX
} from '@/common/validation.js';
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
            return res.status(400).json({
                error: 'Please fill in all required fields'
            });
        }

        // Validate Manchester email
        if (!MANCHESTER_EMAIL_REGEX.test(email)) {
            return res.status(400).json({
                error: { MANCHESTER_EMAIL_ERROR }
            });
        }

        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                error: 'An account with this email already exists'
            });
        }

        // Create new user
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

        return res.status(201).json(newUser);
    } catch (error) {
        console.error('Sign up error:', error);
        return res.status(500).json({
            error: 'Something went wrong during sign up. Please try again.'
        });
    }
};

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                error: 'Please provide both email and password'
            });
        }

        // Get user and check existence
        const user = await getUserByEmail(email.toLowerCase());
        if (!user) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        // Verify password
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userEmail: user.email, userRole: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '30d' }
        );

        return res.status(200).json({
            user,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            error: 'An error occurred during login. Please try again.'
        });
    }
};
