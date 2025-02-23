import express from 'express';
import {
    createFeedback,
    deleteFeedbackById,
    fetchFeedback,
    fetchUserFeedback,
    updateFeedbackById
} from '../services/feedback.services.ts';

export const getAllFeedback = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const feedback = await fetchFeedback();
        return res.status(200).send(feedback);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export const getUserFeedback = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).send('Missing userId in the request.');
        }

        const feedbackEntity = await fetchUserFeedback(userId);
        return res.status(200).send(feedbackEntity);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export const deleteFeedback = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const role = req.user?.userRole;

        if (!userId || !role) {
            return res
                .status(400)
                .send('Missing userId or Role in the request.');
        }

        const deletedFeedback = await deleteFeedbackById(id, userId, role);
        return res.status(200).send(deletedFeedback);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export const updateFeedback = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const role = req.user?.userRole;

        if (!userId || !role) {
            return res
                .status(400)
                .send('Missing userId or Role in the request.');
        }

        const allowedFields = ['type', 'feedback'];

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

        const updatedFeedback = await updateFeedbackById(
            id,
            userId,
            role,
            updatedValues
        );

        return res.status(200).send(updatedFeedback);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export const createNewFeedback = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { type, feedback, user } = req.body;

        if (!type || !feedback || !user) {
            return res.status(400).send({
                error: 'Please provide a type, feedback, and user'
            });
        }

        const newFeedback = await createFeedback({
            type,
            feedback,
            user
        });

        return res.status(201).send(newFeedback);
    } catch (error) {
        return res.status(500).send(error);
    }
};
