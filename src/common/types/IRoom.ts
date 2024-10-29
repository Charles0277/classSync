import { Document } from 'mongoose';

export interface IRoom extends Document {
    name: string;
    type: string;
    capacity: number;
    chairs: number;
    tables: number;
}
