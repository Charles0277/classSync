import { Document, Types } from 'mongoose';

export interface IHoliday extends Document {
    _id: Types.ObjectId;
    name: string;
    startDate: string;
    endDate: string;
}
