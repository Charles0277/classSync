import { ClassModel } from '../models/class.model.js';

export const getClasses = () => ClassModel.find();

export const getClassById = (id: string) => ClassModel.findById({ _id: id });

export const getClassByName = (name: string) =>
    ClassModel.findOne({ name: name });

export const createClass = (values: Record<string, any>) =>
    new ClassModel(values).save().then((savedClass) => savedClass.toObject());

export const updateClassById = (id: string, values: Record<string, any>) =>
    ClassModel.findByIdAndUpdate({ _id: id }, values, { new: true });

export const deleteClassById = (id: string) =>
    ClassModel.findByIdAndDelete({ _id: id });
