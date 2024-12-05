import { Document } from 'mongoose';
import { IScheduleEntry } from './IScheduleEntry.js';

export interface Schedule extends Document {
    userId: string;
    entries: IScheduleEntry[];
}
