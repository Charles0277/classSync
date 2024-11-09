import mongoose, { Model, Schema } from 'mongoose';
import { ICourseUnit } from '../../common/types/ICourseUnit.js';

const courseUnitSchema = new Schema<ICourseUnit>({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    instructor: {
        type: String,
        required: true
    },
    schedule: {
        type: String,
        required: false
    }
});

export const CourseUnitModel: Model<ICourseUnit> = mongoose.model<ICourseUnit>(
    'CourseUnit',
    courseUnitSchema
);
