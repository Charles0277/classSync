import { UserModel } from '../models/user.models.js';

export const fetchAllUsers = () => UserModel.find();

export const fetchUsers = (userIds: string[]) => {
    return UserModel.find({ _id: { $in: userIds } });
};

export const fetchAllTeachers = () => UserModel.find({ role: 'teacher' });

export const fetchAllStudents = () => UserModel.find({ role: 'student' });

export const fetchUserByEmail = (email: string) =>
    UserModel.findOne({ email })
        .populate('course')
        .populate('courseUnits')
        .exec();

export const createUser = (values: Record<string, any>) =>
    new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) => UserModel.findByIdAndDelete(id);

export const updateUserById = (id: string, values: Record<string, any>) =>
    UserModel.findByIdAndUpdate(id, values, { new: true, runValidators: true });

export const deleteUserByEmail = (email: string) =>
    UserModel.findOneAndDelete({ email });

export const updateUserByEmail = (email: string, values: Record<string, any>) =>
    UserModel.findOneAndUpdate({ email }, values, { new: true });
