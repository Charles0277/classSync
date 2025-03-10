import { getIdString } from '@/common/utils.ts';
import express from 'express';
import {
    createClass,
    deleteClassById,
    fetchClassById,
    fetchClassByName,
    fetchClasses,
    updateClassById
} from '../services/class.services.js';

export const getAllClasses = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const classes = await fetchClasses();
        return res.status(201).send(classes);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getClass = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const role = req.user?.userRole;

        if (!role) {
            return res.status(400).send('Missing Role in the request.');
        }

        const classEntity = await fetchClassById(id, role);
        return res.status(201).send(classEntity);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteClass = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const deletedClass = await deleteClassById(id);

        return res.status(201).send(deletedClass);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateClass = async (
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
                .send({ error: 'Missing userId or Role in the request.' });
        }

        const classEntity = await fetchClassById(id, role);

        if (
            getIdString(classEntity?.instructor) !== userId &&
            role !== 'admin'
        ) {
            return res.status(401).send({
                error: 'Permission denied: You are not the teacher of this class'
            });
        }

        const allowedFields = [
            'name',
            'courseUnit',
            'instructor',
            'classTypes',
            'students',
            'semester',
            'description'
        ];

        const invalidFields = Object.keys(req.body).filter(
            (key) => !allowedFields.includes(key)
        );

        if (invalidFields.length > 0) {
            return res
                .status(400)
                .send({ error: `Invalid fields: ${invalidFields.join(', ')}` });
        }

        const updatedValues = Object.fromEntries(
            Object.entries(req.body).filter(([_, value]) => value !== undefined)
        );

        const updatedClass = await updateClassById(
            id,
            userId,
            role,
            updatedValues
        );

        return res.status(200).send(updatedClass);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const createNewClass = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const {
            name,
            courseUnit,
            instructor,
            classTypes,
            students,
            description
        } = req.body;

        if (!name || !courseUnit || !instructor || !classTypes || !students) {
            return res.status(400).send({
                error: 'Please provide a name, courseUnit, instructor, class type, and at least 1 student'
            });
        }

        const newClass = await createClass({
            name,
            courseUnit,
            instructor,
            classTypes,
            students,
            description
        });

        return res.status(201).send(newClass);
    } catch (error) {
        return res.status(400).send(error);
    }
};
