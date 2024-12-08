import { Document, Types } from 'mongoose';

export interface ICourseUnit extends Document {
    name: string;
    code: string;
    size: number;
    instructor: Types.ObjectId;
    classTypes: string[];
}
