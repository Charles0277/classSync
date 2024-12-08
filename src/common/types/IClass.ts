import { Document, Types } from 'mongoose';

export interface IClass extends Document {
    name: string;
    courseUnit: Types.ObjectId;
    instructor: Types.ObjectId;
    classTypes: string[];
    students: Types.ObjectId[];
    semester: 1 | 2 | 0;
}
