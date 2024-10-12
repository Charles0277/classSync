import { Document } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    password: string;
    auth0Id: string;
}
