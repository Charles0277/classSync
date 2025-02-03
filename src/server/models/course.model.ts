import mongoose, { Model, Schema } from 'mongoose';
import { ICourse } from '../../common/types/ICourse.js';

const courseSchema = new Schema<ICourse>(
    {
        name: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true,
            unique: true
        },
        courseUnits: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CourseUnit'
            }
        ]
    },
    { timestamps: true }
);

export const CourseModel: Model<ICourse> = mongoose.model<ICourse>(
    'Course',
    courseSchema
);
