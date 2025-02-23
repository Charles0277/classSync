import express from 'express';
import {
    createNewFeedback,
    deleteFeedback,
    getAllFeedback,
    getUserFeedback,
    updateFeedback
} from '../controllers/feedback.ts';
import {
    authenticateToken,
    checkAdmin
} from '../middleware/authMiddleware/index.ts';

export default (router: express.Router) => {
    router.get('/feedback', authenticateToken, checkAdmin, getAllFeedback);
    router.get('/user-feedback/:userId', authenticateToken, getUserFeedback);
    router.post('/create-feedback', authenticateToken, createNewFeedback);
    router.delete('/delete-feedback/:id', authenticateToken, deleteFeedback);
    router.put('/update-feedback/:id', authenticateToken, updateFeedback);
};
