import express from 'express';
import {
    acceptFriendRequest,
    cancelFriendRequest,
    declineFriendRequest,
    deleteUser,
    getAllStudents,
    getAllTeachers,
    getAllUsers,
    getUser,
    getUsers,
    removeFriend,
    sendFriendRequest,
    updateUser
} from '../controllers/user.js';
import {
    authenticateToken,
    checkAdmin,
    checkTeacher
} from '../middleware/authMiddleware/index.js';

export default (router: express.Router) => {
    router.get('/all-users', authenticateToken, checkAdmin, getAllUsers);
    router.get('/users', authenticateToken, checkTeacher, getUsers);
    router.get('/all-teachers', authenticateToken, checkAdmin, getAllTeachers);
    router.get(
        '/all-students',
        authenticateToken,
        checkTeacher,
        getAllStudents
    );
    router.get('/user/:email', getUser);
    router.delete(
        '/delete-user/:id',
        authenticateToken,
        checkAdmin,
        deleteUser
    );
    router.put('/update-user/:id', authenticateToken, updateUser);
    router.post(
        '/send-friend-request/:email',
        authenticateToken,
        sendFriendRequest
    );
    router.delete('/remove-friend/:friendId', authenticateToken, removeFriend);
    router.post(
        '/accept-friend-request',
        authenticateToken,
        acceptFriendRequest
    );
    router.post(
        '/decline-friend-request',
        authenticateToken,
        declineFriendRequest
    );
    router.post(
        '/cancel-friend-request',
        authenticateToken,
        cancelFriendRequest
    );
};
