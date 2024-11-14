import { CourseUnitModel } from '../models/courseUnit.model.js';

export const getCourseUnitsByCourse = (course: string) =>
    CourseUnitModel.find({
        code: { $regex: `^${course}`, $options: 'i' }
    });

export const getCourseUnit = (code: string) =>
    CourseUnitModel.findOne({ code });

export const createCourseUnit = (values: Record<string, any>) =>
    new CourseUnitModel(values)
        .save()
        .then((courseUnit) => courseUnit.toObject());

export const deleteCourseUnitByCode = (code: string) =>
    CourseUnitModel.findOneAndDelete({ code });

export const updateCourseUnitByCode = (
    code: string,
    values: Record<string, any>
) => CourseUnitModel.findOneAndUpdate({ code }, values, { new: true });
