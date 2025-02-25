import { Document } from 'mongoose';

export interface ISchoolDates extends Document {
    activity: string;
    startDate: Date;
    endDate: Date;
}
