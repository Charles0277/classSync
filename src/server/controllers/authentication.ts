import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';

import {
    isValidCourse,
    isValidCourseUnits,
    MANCHESTER_EMAIL_ERROR,
    MANCHESTER_EMAIL_REGEX
} from '@/common/validation.js';
import mongoose from 'mongoose';
import { createUser, fetchUserByEmail } from '../services/user.services.js';

export const signUp = async (req: express.Request, res: express.Response) => {
    try {
        const {
            firstName: rawFirstName,
            lastName: rawLastName,
            email: rawEmail,
            password,
            confirmPassword,
            yearOfStudy: rawYearOfStudy,
            course,
            courseUnits
        } = req.body;

        const processedFirstName = rawFirstName?.trim();
        const processedLastName = rawLastName?.trim();
        const processedEmail = rawEmail?.trim().toLowerCase();
        const processedYearOfStudy = parseInt(rawYearOfStudy, 10);

        if (
            !processedFirstName ||
            !processedLastName ||
            !processedEmail ||
            !password ||
            !confirmPassword ||
            isNaN(processedYearOfStudy) ||
            !course ||
            !courseUnits
        ) {
            return res.status(400).send({
                error: 'Please fill in all required fields.'
            });
        }

        const allowedFields = [
            'firstName',
            'lastName',
            'email',
            'password',
            'confirmPassword',
            'yearOfStudy',
            'course',
            'courseUnits'
        ];

        const invalidFields = Object.keys(req.body).filter(
            (key) => !allowedFields.includes(key)
        );

        if (invalidFields.length > 0) {
            return res.status(400).send({
                error: `Invalid fields: ${invalidFields.join(', ')}`
            });
        }

        if (!/^[a-zA-Z]{2,50}$/.test(processedFirstName)) {
            return res.status(400).send({
                error: 'First name must be between 2-50 characters and contain only letters'
            });
        }

        if (!/^[a-zA-Z]{2,50}$/.test(processedLastName)) {
            return res.status(400).send({
                error: 'Last name must be between 2-50 characters and contain only letters'
            });
        }

        if (!MANCHESTER_EMAIL_REGEX.test(processedEmail)) {
            return res.status(400).send({
                error: MANCHESTER_EMAIL_ERROR
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).send({
                error: 'Passwords do not match'
            });
        }

        const passwordRegex =
            /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}/;
        if (!passwordRegex.test(password)) {
            return res.status(400).send({
                error: 'Password must contain 8+ characters with uppercase, number, and special character'
            });
        }

        const validYears = [1, 2, 3, 4, 5, 7];
        if (!validYears.includes(processedYearOfStudy)) {
            return res.status(400).send({
                error: 'Invalid year of study. Valid years: 1, 2, 3, 4, 5, 7'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(course)) {
            return res.status(400).send({
                error: 'Invalid course ID'
            });
        }

        if (!(await isValidCourse(course))) {
            return res.status(400).send({
                error: `Invalid Course ID ${course}`
            });
        }

        const unitsValidation = await isValidCourseUnits(courseUnits);
        if (!unitsValidation.valid) {
            return res.status(400).send({
                error: unitsValidation.invalidIds?.length
                    ? `Invalid course unit IDs: ${unitsValidation.invalidIds.join(', ')}`
                    : 'Invalid course units format'
            });
        }

        const existingUser = await fetchUserByEmail(processedEmail);
        if (existingUser) {
            return res.status(409).send({
                error: 'Account with this email already exists'
            });
        }

        const newUser = await createUser({
            firstName: processedFirstName,
            lastName: processedLastName,
            email: processedEmail,
            password,
            yearOfStudy: processedYearOfStudy,
            course,
            courseUnits
        });

        return res.status(201).json(newUser);
    } catch (error) {
        console.error('Sign up error:', error);
        return res.status(500).send({
            error: 'Something went wrong during sign up. Please try again.'
        });
    }
};

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).send({
                error: 'Please provide both email and password.'
            });
        }

        // Fetch user and check existence
        const user = await fetchUserByEmail(email.toLowerCase());
        if (!user) {
            return res.status(401).send({
                error: 'Email does not exist.'
            });
        }

        // Verify password
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({
                error: 'Incorrect password.'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, userEmail: user.email, userRole: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '30d' }
        );

        return res.status(200).send({
            user,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).send({
            error: 'An error occurred during login. Please try again.'
        });
    }
};
