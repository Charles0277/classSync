import { UserModel } from '../models/user.models.js';

export const getUsers = () => UserModel.find();

// export const getUserByEmail = (email: string) => UserModel.findOne({ email });

export const getUserByEmail = (email: string) =>
    UserModel.findOne({ email })
        .populate('course')
        // .populate('courseUnits')
        .exec();

export const createUser = (values: Record<string, any>) =>
    new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) => UserModel.findByIdAndDelete(id);

export const updateUserById = (id: string, values: Record<string, any>) =>
    UserModel.findByIdAndUpdate(id, values, { new: true });

export const deleteUserByEmail = (email: string) =>
    UserModel.findOneAndDelete({ email });

export const updateUserByEmail = (email: string, values: Record<string, any>) =>
    UserModel.findOneAndUpdate({ email }, values, { new: true });
