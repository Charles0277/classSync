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
        .exec();

export const createUser = (values: Record<string, any>) =>
    new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) => UserModel.findByIdAndDelete(id);

export const updateUserById = (id: string, values: Record<string, any>) =>
    UserModel.findByIdAndUpdate(id, values, {
        new: true,
        runValidators: true
    }).populate('friends', '_id firstName lastName');

export const deleteUserByEmail = (email: string) =>
    UserModel.findOneAndDelete({ email });

export const updateUserByEmail = (email: string, values: Record<string, any>) =>
    UserModel.findOneAndUpdate({ email }, values, { new: true });

export const addFriendToUser = (id: string, friendId: Types.ObjectId) =>
    UserModel.findByIdAndUpdate(id, { $addToSet: { friends: friendId } });

export const removeFriendFromUser = (id: string, friendId: Types.ObjectId) =>
    UserModel.findByIdAndUpdate(id, { $pull: { friends: friendId } });
