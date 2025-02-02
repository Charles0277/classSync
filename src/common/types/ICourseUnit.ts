import { Document, Types } from 'mongoose';

export interface ICourseUnit extends Document {
    _id: Types.ObjectId;
    name: string;
    code: string;
    size: number;
    instructor: Types.ObjectId;
    classTypes: string[];
}
