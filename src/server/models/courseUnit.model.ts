import mongoose, { CallbackError, Model, Schema } from 'mongoose';
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
    size: {
        type: Number,
        default: 0,
        required: true,
        min: [0, 'Size cannot be negative']
    },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export const CourseUnitModel: Model<ICourseUnit> = mongoose.model<ICourseUnit>(
    'CourseUnit',
    courseUnitSchema,
    'course_units'
);
