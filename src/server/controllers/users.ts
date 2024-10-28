import express from 'express';
import {
    deleteUserById,
    getUserByEmail,
    getUsers,
    updateUserById
} from '../services/user.services.js';

export const getallUsers = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const users = await getUsers();
        return res.status(201).send(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getUser = async (req: express.Request, res: express.Response) => {
    try {
        const { email } = req.params;
        const user = await getUserByEmail(email);
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
    try {
        const { id } = req.params;

        const allowedFields = ['firstName', 'lastName', 'email', 'password'];

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

        const updatedUser = await updateUserById(id, updatedValues);

        return res.status(201).send(updatedUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
