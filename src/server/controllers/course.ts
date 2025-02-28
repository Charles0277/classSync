import express from 'express';
import {
    createCourse,
    deleteCourseById,
    fetchCourseByCode,
    fetchCourseById,
    fetchCourses,
    updateCourseById
} from '../services/course.services.js';

export const getAllCourses = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const courses = await fetchCourses();
        return res.status(201).send(courses);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getCourse = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const course = await fetchCourseById(id);
        return res.status(201).send(course);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteCourse = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const deleteCourse = await deleteCourseById(id);

        return res.status(201).send(deleteCourse);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateCourse = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;

        const allowedFields = ['name', 'code', 'courseUnits'];

        const invalidFields = Object.keys(req.body).filter(
            (key) => !allowedFields.includes(key)
        );

        if (invalidFields.length > 0) {
            return res
                .status(400)
                .send(`Invalid fields: ${invalidFields.join(', ')}.`);
        }

        const updatedValues = Object.fromEntries(
            Object.entries(req.body).filter(([_, value]) => value !== undefined)
        );

        const updatedCourse = await updateCourseById(id, updatedValues);

        return res.status(201).send(updatedCourse);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const createNewCourse = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { name, code, courseUnits } = req.body;

        if (!name || !code || !courseUnits) {
            return res.status(400).send({
                error: 'Please provide a name, code, and at least 1 course unit.'
            });
        }

        const existingCourse = await fetchCourseByCode(code);

        if (existingCourse) {
            return res.status(400).send({ error: 'Course already exists.' });
        }

        const newCourse = await createCourse({
            name,
            code,
            courseUnits
        });

        return res.status(201).send(newCourse);
    } catch (error) {
        return res.status(400).send(error);
    }
};
