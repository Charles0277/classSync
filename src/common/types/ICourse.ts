import { Document, Types } from 'mongoose';
import { ICourseUnit } from './ICourseUnit.js';

export interface ICourse extends Document {
    name: string;
    code: string;
    courseUnits: Types.ObjectId[] | ICourseUnit[];
}
