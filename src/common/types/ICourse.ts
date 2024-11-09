import { Document, Types } from 'mongoose';

export interface ICourse extends Document {
    name: string;
    code: string;
    courseUnits: Types.ObjectId[];
}
