import { CourseUnitModel } from '../models/courseUnit.model.js';

// export const getCourseUnitsByCourse = (course: string) =>
//     CourseUnitModel.find({
//         code: { $regex: `^${course}`, $options: 'i' }
//     });

export const getCourseUnits = () => CourseUnitModel.find();

export const getCourseUnitByCode = (code: string) =>
    CourseUnitModel.findOne({ code });

export const getCourseUnitById = (id: string) =>
    CourseUnitModel.findById({ _id: id });

export const createCourseUnit = (values: Record<string, any>) =>
    new CourseUnitModel(values)
        .save()
        .then((courseUnit) => courseUnit.toObject());

export const deleteCourseUnitByCode = (code: string) =>
    CourseUnitModel.findOneAndDelete({ code });

export const deleteCourseUnitById = (id: string) =>
    CourseUnitModel.findByIdAndDelete({ _id: id });

export const updateCourseUnitById = (id: string, values: Record<string, any>) =>
    CourseUnitModel.findByIdAndUpdate({ _id: id }, values, { new: true });
