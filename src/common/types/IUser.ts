import { Document, Schema, Types } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    password: string;
    yearOfStudy: number;
    course: Types.ObjectId;
    courseUnits: Types.ObjectId[];
}
