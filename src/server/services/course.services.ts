import { CourseModel } from '../models/course.model.js';

export const getCourses = () => CourseModel.find();

export const getCourseByCode = (code: string) => CourseModel.findOne({ code });

export const createCourse = (values: Record<string, any>) =>
    new CourseModel(values).save().then((course) => course.toObject());

export const updateCourseByCode = (code: string, values: Record<string, any>) =>
    CourseModel.findOneAndUpdate({ code: code }, values, { new: true });

export const deleteCourseByCode = (code: string) =>
    CourseModel.findOneAndDelete({ code });
