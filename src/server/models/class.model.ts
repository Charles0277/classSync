import { IClass } from '@/common/types/IClass.js';
import mongoose, { Model, Schema } from 'mongoose';

const classSchema = new Schema<IClass>({
    name: {
        type: String,
        required: true
    },
    courseUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    semester: {
        type: Number,
        min: 0,
        max: 2,
        required: true
    }
});

export const ClassModel: Model<IClass> = mongoose.model<IClass>(
    'Class',
    classSchema
);
