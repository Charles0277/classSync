import { CourseModel } from '../models/course.model.js';

export const fetchCourses = () => CourseModel.find().populate('courseUnits');

export const fetchCourseByCode = (code: string) =>
    CourseModel.findOne({ code });

export const fetchCourseById = (id: string) =>
    CourseModel.findById({ _id: id });

export const createCourse = (values: Record<string, any>) =>
    new CourseModel(values)
        .save()
        .then((course) =>
            course
                .populate('courseUnits')
                .then((populatedCourse) => populatedCourse.toObject())
        );

export const updateCourseById = (id: string, values: Record<string, any>) =>
    CourseModel.findByIdAndUpdate({ _id: id }, values, {
        new: true,
        runValidators: true
    }).populate('courseUnits');

export const deleteCourseByCode = (code: string) =>
    CourseModel.findOneAndDelete({ code });

export const deleteCourseById = (id: string) =>
    CourseModel.findByIdAndDelete({ _id: id });
