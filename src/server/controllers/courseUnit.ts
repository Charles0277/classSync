import express from 'express';
import {
    createCourseUnit,
    deleteCourseUnitById,
    fetchCourseUnitByCode,
    fetchCourseUnitById,
    fetchCourseUnits,
    updateCourseUnitById
} from '../services/courseUnit.services.ts';

export const getAllCourseUnits = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const courseUnits = await fetchCourseUnits();
        return res.status(201).send(courseUnits);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getCourseUnit = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const course = await fetchCourseUnitById(id);
        return res.status(201).send(course);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteCourseUnit = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const deletedCourseUnit = await deleteCourseUnitById(id);

        return res.status(201).send(deletedCourseUnit);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateCourseUnit = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;

        const allowedFields = ['name', 'code', 'instructor', 'classTypes'];

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

        const updatedCourseUnit = await updateCourseUnitById(id, updatedValues);

        return res.status(201).send(updatedCourseUnit);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const createNewCourseUnit = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { name, code, instructor, classTypes } = req.body;

        if (!name || !code || !instructor || !classTypes) {
            return res.status(400).send({
                error: 'Please provide a name, code, class type, and a instructor.'
            });
        }

        const existingCourseUnit = await fetchCourseUnitByCode(code);

        if (existingCourseUnit) {
            return res
                .status(400)
                .send({ error: 'Course unit already exists.' });
        }

        const newCourseUnit = await createCourseUnit({
            name,
            code,
            instructor,
            classTypes
        });

        return res.status(201).send(newCourseUnit);
    } catch (error) {
        return res.status(400).send(error);
    }
};
