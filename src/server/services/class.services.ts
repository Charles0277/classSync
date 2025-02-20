import { getIdString } from '@/common/utils.ts';
import { ClassModel } from '../models/class.model.js';

export const getClasses = () => ClassModel.find();

export const getClassById = (id: string, role: string) => {
    if (role === 'student') {
        return ClassModel.findById({ _id: id }).select('-students');
    } else {
        return ClassModel.findById({ _id: id });
    }
};

export const getClassByName = (name: string) =>
    ClassModel.findOne({ name: name });

export const createClass = (values: Record<string, any>) =>
    new ClassModel(values).save().then((savedClass) => savedClass.toObject());

export const updateClassById = async (
    id: string,
    userId: string,
    role: string,
    values: Record<string, any>
) => {
    const classEntity = await getClassById(id, role);

    if (!classEntity) {
        throw new Error('Class not found');
    }

    if (getIdString(classEntity.instructor) !== userId) {
        throw new Error(
            'Permission denied: You are not the owner of this class'
        );
    }

    return ClassModel.findByIdAndUpdate({ _id: id }, values, {
        new: true,
        runValidators: true
    });
};

export const deleteClassById = (id: string) =>
    ClassModel.findByIdAndDelete({ _id: id });

export const deleteAllClasses = () => ClassModel.deleteMany({});
