import { Request, Response } from 'express';
import {
    fetchSchoolWeekConfig,
    initialiseSchoolWeekConfig,
    modifySchoolWeekConfig
} from '../services/schoolWeek.services.js';

export const getSchoolWeekConfig = async (req: Request, res: Response) => {
    try {
        const config = await fetchSchoolWeekConfig();
        res.status(200).json(config);
    } catch (error) {
        res.status(404).json({
            message: 'School week configuration not found.'
        });
    }
};

export const createSchoolWeekConfig = async (req: Request, res: Response) => {
    const { daysInWeek, hoursPerDay, startHour, endHour } = req.body;

    const existingConfig = await fetchSchoolWeekConfig();

    if (existingConfig) {
        return res.status(400).send({ error: 'A config already exists' });
    }

    try {
        const config = await initialiseSchoolWeekConfig({
            daysInWeek,
            hoursPerDay,
            startHour,
            endHour
        });
        res.status(201).json(config);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to initialize school week configuration.'
        });
    }
};

export const updateSchoolWeekConfig = async (req: Request, res: Response) => {
    const allowedFields = ['daysInWeek', 'hoursPerDay', 'startHour', 'endHour'];

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

    try {
        const updatedConfig = await modifySchoolWeekConfig(updatedValues);
        res.status(200).json(updatedConfig);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update school week configuration.'
        });
    }
};
