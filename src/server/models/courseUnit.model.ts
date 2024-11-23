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
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export const CourseUnitModel: Model<ICourseUnit> = mongoose.model<ICourseUnit>(
    'CourseUnit',
    courseUnitSchema,
    'course_units'
);
