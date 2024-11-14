import express from 'express';
import { createCourse } from '../services/course.services.js';
import {
    createCourseUnit,
    deleteCourseUnitByCode,
    getCourseUnit,
    updateCourseUnitByCode
} from '../services/courseUnits.services.js';

// export const getAllCourses = async (
//     req: express.Request,
//     res: express.Response
// ) => {
//     try {
//         const courses = await getCourses();
//         return res.status(201).send(courses);
//     } catch (error) {
//         console.log(error);
//         return res.sendStatus(400);
//     }
// };

// export const getCourseUnit = async (
//     req: express.Request,
//     res: express.Response
// ) => {
//     try {
//         const { code } = req.params;
//         const course = await getCourseByCode(code);
//         return res.status(201).send(course);
//     } catch (error) {
//         console.log(error);
//         return res.sendStatus(400);
//     }
// };

export const deleteCourseUnit = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { code } = req.params;
        const deletedCourseUnit = await deleteCourseUnitByCode(code);

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
        const { code } = req.params;

        const allowedFields = ['name', 'code', 'instructor'];

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

        const updatedCourseUnit = await updateCourseUnitByCode(
            code,
            updatedValues
        );

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
        const { name, code, instructor } = req.body;

        if (!name || !code || !instructor) {
            return res.status(400).send({
                error: 'Please provide a name, code, and a instructor'
            });
        }

        const existingCourseUnit = await getCourseUnit(code);

        if (existingCourseUnit) {
            return res
                .status(400)
                .send({ error: 'Course unit already exists' });
        }

        const newCourseUnit = await createCourseUnit({
            name,
            code,
            instructor
        });

        return res.status(201).send(newCourseUnit);
    } catch (error) {
        return res.status(400).send(error);
    }
};
