import { Document } from 'mongoose';

export interface ISchoolWeekConfig extends Document {
    daysInWeek: number;
    hoursPerDay: number;
    startHour: number; // e.g., 8 for 8:00 AM
    endHour: number; // e.g., 17 for 5:00 PM
}
