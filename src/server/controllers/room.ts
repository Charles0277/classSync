import express from 'express';
import {
    createRoom,
    deleteRoomById,
    fetchRoomByName,
    fetchRooms,
    updateRoomById
} from '../services/room.services.js';

export const getAllRooms = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const rooms = await fetchRooms();
        return res.status(201).send(rooms);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getRoom = async (req: express.Request, res: express.Response) => {
    try {
        const { name } = req.params;
        const room = await fetchRoomByName(name);
        return res.status(201).send(room);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteRoom = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const deleteRoom = await deleteRoomById(id);

        return res.status(201).send(deleteRoom);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateRoom = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;

        const allowedFields = ['name', 'type', 'capacity', 'chairs', 'tables'];

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

        const updatedRoom = await updateRoomById(id, updatedValues);

        return res.status(201).send(updatedRoom);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const createNewRoom = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { name, type, capacity, chairs, tables } = req.body;

        if (!name || !type || !capacity || !chairs || !tables) {
            return res.status(400).send({
                error: 'Please provide a name, room type, capacity, number of chairs, and number of tables.'
            });
        }

        const existingRoom = await fetchRoomByName(name);

        if (existingRoom) {
            return res.status(400).send({ error: 'Room already exists.' });
        }

        const newRoom = await createRoom({
            name,
            type,
            capacity,
            chairs,
            tables
        });

        return res.status(201).send(newRoom);
    } catch (error) {
        return res.status(400).send(error);
    }
};
