import { Types } from 'mongoose';
import { UserModel } from '../models/user.models.js';

export const fetchAllUsers = () => UserModel.find();

export const fetchUserById = (id: string) => UserModel.findById(id);

export const fetchUsers = (userIds: string[]) => {
    return UserModel.find({ _id: { $in: userIds } });
};

export const fetchAllTeachers = () => UserModel.find({ role: 'teacher' });

export const fetchAllStudents = () => UserModel.find({ role: 'student' });

export const fetchUserByEmail = (email: string) =>
    UserModel.findOne({ email })
        .populate('course')
        .populate('courseUnits')
        .populate('friends', '_id firstName lastName')
        .populate('friendRequests', '_id firstName lastName')
        .populate('sentRequests', '_id firstName lastName')
        .exec();

export const createUser = (values: Record<string, any>) =>
    new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) => UserModel.findByIdAndDelete(id);

export const updateUserById = (id: string, values: Record<string, any>) =>
    UserModel.findByIdAndUpdate(id, values, {
        new: true,
        runValidators: true
    })
        .populate('friends', '_id firstName lastName')
        .populate('friendRequests', '_id firstName lastName')
        .populate('sentRequests', '_id firstName lastName');

export const deleteUserByEmail = (email: string) =>
    UserModel.findOneAndDelete({ email });

export const updateUserByEmail = (email: string, values: Record<string, any>) =>
    UserModel.findOneAndUpdate({ email }, values, { new: true });

export const sendFriendRequestToUser = async (
    id: string,
    friendId: Types.ObjectId
) => {
    await UserModel.findByIdAndUpdate(
        friendId,
        {
            $addToSet: { friendRequests: id }
        },
        { upsert: true }
    );
    await UserModel.findByIdAndUpdate(
        id,
        {
            $addToSet: { sentRequests: friendId }
        },
        { upsert: true }
    );
};

export const removeFriendFromUser = async (
    id: Types.ObjectId,
    friendId: Types.ObjectId
) => {
    await UserModel.findByIdAndUpdate(id, { $pull: { friends: friendId } });
    await UserModel.findByIdAndUpdate(friendId, { $pull: { friends: id } });
};

export const acceptFriendRequestToUser = async (
    id: Types.ObjectId,
    friendId: Types.ObjectId
) => {
    // Update current user: add friend and remove from their requests
    await UserModel.findByIdAndUpdate(
        id,
        {
            $addToSet: { friends: friendId },
            $pull: { friendRequests: friendId }
        },
        { upsert: true }
    );

    // Update friend: add current user to their friends
    await UserModel.findByIdAndUpdate(
        friendId,
        {
            $addToSet: { friends: id },
            $pull: { sentRequests: id }
        },
        { upsert: true }
    );
};

export const declineFriendRequestToUser = async (
    id: string,
    friendId: Types.ObjectId
) => {
    await UserModel.findByIdAndUpdate(id, {
        $pull: { friendRequests: friendId }
    });
    await UserModel.findByIdAndUpdate(friendId, {
        $pull: { sentRequests: id }
    });
};

export const cancelFriendRequestToUser = async (
    id: string,
    friendId: Types.ObjectId
) => {
    await UserModel.findByIdAndUpdate(id, {
        $pull: { sentRequests: friendId }
    });
    await UserModel.findByIdAndUpdate(friendId, {
        $pull: { friendRequests: id }
    });
};
