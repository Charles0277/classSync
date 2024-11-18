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
} from '../controllers/room.js';

export default (router: express.Router) => {
    router.get('/rooms', authenticateToken, getAllRooms);
    router.get('/room/:name', getRoom);
    router.delete(
        '/delete-room/:id',
        authenticateToken,
        // checkAdmin,
        deleteRoom
    );
    router.put('/update-room/:id', authenticateToken, updateRoom);
    router.post('/create-room', authenticateToken, createNewRoom);
};
