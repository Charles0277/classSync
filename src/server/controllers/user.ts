import {
    MANCHESTER_EMAIL_ERROR,
    MANCHESTER_EMAIL_REGEX
} from '@/common/validation.js';
import express from 'express';
import { Types } from 'mongoose';
import {
    addFriendToUser,
    deleteUserById,
    fetchAllStudents,
    fetchAllTeachers,
    fetchAllUsers,
    fetchUserByEmail,
    fetchUserById,
    fetchUsers,
    removeFriendFromUser,
    updateUserById
} from '../services/user.services.js';

export const getAllUsers = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const users = await fetchAllUsers();
        return res.status(201).send(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getUsers = async (req: express.Request, res: express.Response) => {
    const userIds = req.query;
    const userIdsArray = Object.values(userIds);
    try {
        const users = await fetchUsers(userIdsArray as string[]);
        return res.status(201).send(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getAllTeachers = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const teachers = await fetchAllTeachers();
        return res.status(200).send(teachers);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getAllStudents = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const students = await fetchAllStudents();
        return res.status(200).send(students);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getUser = async (req: express.Request, res: express.Response) => {
    try {
        const { email } = req.params;
        const user = await fetchUserByEmail(email);
        return res.status(201).send(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteUser = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);

        return res.status(201).send(deletedUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateUser = async (
    req: express.Request,
    res: express.Response
) => {
    const { id } = req.params;
    try {
        const userId = req.user?.userId;
        const role = req.user?.userRole;

        if (!userId || !role) {
            return res
                .status(400)
                .send('Missing userId or Role in the request.');
        }

        if (id !== userId && role !== 'admin') {
            return res
                .status(403)
                .send({ error: 'You are not authorized to update this user.' });
        }

        const allowedFields = [
            'firstName',
            'lastName',
            'email',
            'role',
            'yearOfStudy',
            'course',
            'courseUnits',
            'password',
            'confirmPassword'
        ];

        const invalidFields = Object.keys(req.body).filter(
            (key) => !allowedFields.includes(key)
        );

        if (invalidFields.length > 0) {
            return res
                .status(400)
                .send(`Invalid fields: ${invalidFields.join(', ')}`);
        }

        const updatedValues = Object.fromEntries(
            Object.entries(req.body).filter(([_, value]) => value !== undefined)
        );

        if (
            updatedValues.email &&
            !MANCHESTER_EMAIL_REGEX.test(updatedValues.email.toString())
        ) {
            return res.status(400).json({ error: MANCHESTER_EMAIL_ERROR });
        }

        const updatedUser = await updateUserById(id, updatedValues);

        return res.status(201).send(updatedUser);
    } catch (error) {
        return res.sendStatus(400);
    }
};

export const addFriend = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { email } = req.params;
        const userId = req.user?.userId;
        const role = req.user?.userRole;

        if (!userId || !role) {
            return res
                .status(400)
                .send('Missing userId or Role in the request.');
        }

        const existingUser = await fetchUserByEmail(email);
        if (!existingUser) {
            return res.status(409).json({
                error: 'This user does not exist.'
            });
        }
        if (existingUser.role !== role) {
            return res
                .status(403)
                .send('You are not authorized to add this user as a friend.');
        }

        const currentUser = await fetchUserById(userId);

        const isAlreadyFriend = (
            currentUser?.friends as Types.ObjectId[]
        )?.some((friendId) => friendId.equals(existingUser._id));
        if (isAlreadyFriend) {
            return res.status(409).json({ error: 'User is already a friend.' });
        }

        await addFriendToUser(userId, existingUser._id);

        return res.status(200).send({
            _id: existingUser._id,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const removeFriend = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { friendId } = req.params;
        const userId = req.user?.userId;
        const role = req.user?.userRole;

        if (!userId || !role) {
            return res
                .status(400)
                .send('Missing userId or Role in the request.');
        }

        const currentUser = await fetchUserById(userId);
        const friend = await fetchUserById(friendId);

        if (!currentUser || !friend) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const isFriend = (currentUser?.friends as Types.ObjectId[])?.some(
            (friendId) => friendId.equals(friend._id)
        );

        if (!isFriend) {
            return res.status(404).json({ error: 'User is not a friend.' });
        }

        await removeFriendFromUser(userId, friend._id);

        return res.status(200).send({
            _id: friend._id,
            firstName: friend.firstName,
            lastName: friend.lastName
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
