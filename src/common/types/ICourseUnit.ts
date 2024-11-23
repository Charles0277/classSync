import { Document, Types } from 'mongoose';

export interface ICourseUnit extends Document {
    name: string;
    code: string;
    instructor: Types.ObjectId;
}
