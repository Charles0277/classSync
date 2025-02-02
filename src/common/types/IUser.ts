import { Document, Types } from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    password: string;
    yearOfStudy: number;
    course: Types.ObjectId;
    courseUnits: Types.ObjectId[];
    schedule?: Types.ObjectId[];
}
