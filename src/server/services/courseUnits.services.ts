import { CourseUnitModel } from '../models/courseUnit.model.js';

export const getCourseUnits = () =>
    CourseUnitModel.find().populate('instructor');

export const getCourseUnitByCode = (code: string) =>
    CourseUnitModel.findOne({ code });

export const getCourseUnitById = (id: string) =>
    CourseUnitModel.findById({ _id: id });

export const createCourseUnit = (values: Record<string, any>) =>
    new CourseUnitModel(values)
        .save()
        .then((courseUnit) => courseUnit.populate('instructor'))
        .then((courseUnit) => courseUnit.toObject());

export const deleteCourseUnitByCode = (code: string) =>
    CourseUnitModel.findOneAndDelete({ code });

export const deleteCourseUnitById = (id: string) =>
    CourseUnitModel.findByIdAndDelete({ _id: id });

export const updateCourseUnitById = (id: string, values: Record<string, any>) =>
    CourseUnitModel.findByIdAndUpdate({ _id: id }, values, {
        new: true,
        runValidators: true
    }).populate('instructor');
