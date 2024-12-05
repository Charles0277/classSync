import { Document } from 'mongoose';

export interface IScheduleEntry extends Document {
    classId: string;
    roomId: string;
    day: number;
    hour: number;
}
