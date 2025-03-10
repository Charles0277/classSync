import { Document, Types } from 'mongoose';

export interface IFriend {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
}

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
    friends?: Types.ObjectId[] | IFriend[];
    friendRequests?: Types.ObjectId[] | IFriend[];
    sentRequests?: Types.ObjectId[] | IFriend[];
}
