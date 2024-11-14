import { Document } from 'mongoose';

export interface ICourseUnit extends Document {
    name: string;
    code: string;
    instructor: string;
}
