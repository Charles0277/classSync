import express from 'express';
import {
    createNewRoom,
    deleteRoom,
    getAllRooms,
    getRoom,
    updateRoom
} from '../controllers/room.js';
import {
    authenticateToken,
    checkAdmin,
    checkTeacher
} from '../middleware/authMiddleware/index.js';

export default (router: express.Router) => {
    router.get('/rooms', authenticateToken, checkTeacher, getAllRooms);
    router.get('/room/:name', getRoom);
    router.delete(
        '/delete-room/:id',
        authenticateToken,
        checkAdmin,
        deleteRoom
    );
    router.put('/update-room/:id', authenticateToken, checkAdmin, updateRoom);
    router.post('/create-room', authenticateToken, checkAdmin, createNewRoom);
};
