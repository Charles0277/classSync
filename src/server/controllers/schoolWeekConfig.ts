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
    const { daysPerWeek, hoursPerDay, startHour, endHour } = req.body;

    const existingConfig = await fetchSchoolWeekConfig();

    if (existingConfig) {
        return res.status(400).send({ error: 'A config already exists' });
    }

    try {
        const config = await initialiseSchoolWeekConfig({
            daysPerWeek,
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
    const allowedFields = [
        'daysPerWeek',
        'hoursPerDay',
        'startHour',
        'endHour'
    ];

    // Filter out invalid fields
    const filteredBody = Object.fromEntries(
        Object.entries(req.body).filter(
            ([key, value]) => allowedFields.includes(key) && value !== undefined
        )
    );

    // Identify any disallowed fields
    const invalidFields = Object.keys(req.body).filter(
        (key) => !allowedFields.includes(key) && key !== '_id' && key !== '__v'
    );

    // If there are invalid fields, respond with a 400 error
    if (invalidFields.length > 0) {
        return res.status(400).json({
            message: `Invalid fields: ${invalidFields.join(', ')}`
        });
    }

    // Proceed with updating if valid
    try {
        const updatedConfig = await modifySchoolWeekConfig(filteredBody);

        // Return success response with updated configuration
        return res.status(200).json({
            message: 'School week configuration updated successfully.',
            data: updatedConfig
        });
    } catch (error) {
        console.error('Error updating school week configuration:', error);

        // Return a 500 error with details
        return res.status(500).json({
            message: 'Failed to update school week configuration.',
            error: error || 'Unknown error'
        });
    }
};
