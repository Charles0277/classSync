import express from 'express';
import {
    authenticateToken,
    checkAdmin
} from '../middleware/authMiddleware/index.js';
import {
    createNewRoom,
    deleteRoom,
    getAllRooms,
    getRoom,
    updateRoom
} from '../controllers/rooms.js';

export default (router: express.Router) => {
    router.get('/rooms', authenticateToken, getAllRooms);
    router.get('/room/:name', getRoom);
    router.delete(
        '/delete-room/:name',
        authenticateToken,
        checkAdmin,
        deleteRoom
    );
    router.put('/update-room/:name', authenticateToken, checkAdmin, updateRoom);
    router.post('/create-room', authenticateToken, createNewRoom);
};
