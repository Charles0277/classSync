import express from 'express';
import {
    createHoliday,
    deleteHolidayById,
    fetchHolidayByName,
    fetchHolidays,
    updateHolidayById
} from '../services/holiday.services.ts';

export const getAllHolidays = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const holidays = await fetchHolidays();
        return res.status(200).send(holidays);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteHoliday = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const deleteHoliday = await deleteHolidayById(id);

        return res.status(200).send(deleteHoliday);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateHoliday = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;

        const allowedFields = ['name', 'startDate', 'endDate'];

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

        const updatedHoliday = await updateHolidayById(id, updatedValues);

        return res.status(200).send(updatedHoliday);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const createNewHoliday = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { name, startDate, endDate } = req.body;

        if (!name || !startDate || !endDate) {
            return res.status(400).send({
                error: 'Please provide a name, start date, and end date.'
            });
        }

        const existingHoliday = await fetchHolidayByName(name);

        if (existingHoliday) {
            return res.status(400).send({ error: 'Holiday already exists.' });
        }

        const newHoliday = await createHoliday({
            name,
            startDate,
            endDate
        });

        return res.status(201).send(newHoliday);
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
};
