import express from 'express';
import {
    createClass,
    deleteClassById,
    getClassById,
    getClassByName,
    getClasses,
    updateClassById
} from '../services/class.services.js';

export const getAllClasses = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const classes = await getClasses();
        return res.status(201).send(classes);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getClass = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const classEntity = await getClassById(id);
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

        const allowedFields = [
            'name',
            'courseUnit',
            'instructor',
            'classTypes',
            'students',
            'semester'
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

        const updatedClass = await updateClassById(id, updatedValues);

        return res.status(201).send(updatedClass);
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
        const { name, courseUnit, instructor, classTypes, students, semester } =
            req.body;

        if (
            !name ||
            !courseUnit ||
            !instructor ||
            !classTypes ||
            !students ||
            !semester
        ) {
            return res.status(400).send({
                error: 'Please provide a name, courseUnit, instructor, class type, semester, and at least 1 student'
            });
        }

        const existingClass = await getClassByName(name);

        if (existingClass) {
            return res.status(400).send({ error: 'Class already exists' });
        }

        const newClass = await createClass({
            name,
            courseUnit,
            instructor,
            classTypes,
            students,
            semester
        });

        return res.status(201).send(newClass);
    } catch (error) {
        return res.status(400).send(error);
    }
};
