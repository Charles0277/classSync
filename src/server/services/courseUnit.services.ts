import { CourseUnitModel } from '../models/courseUnit.model.ts';

export const fetchCourseUnits = () =>
    CourseUnitModel.find().populate('instructor');

export const fetchCourseUnitByCode = (code: string) =>
    CourseUnitModel.findOne({ code });

export const fetchCourseUnitById = (id: string) =>
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
