import { Document, Types } from 'mongoose';

export interface IRoom extends Document {
    _id: Types.ObjectId;
    name: string;
    type: string;
    capacity: number;
    chairs: number;
    tables: number;
}
