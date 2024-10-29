import mongoose, { Schema, Model, CallbackError } from 'mongoose';
import { ISchoolWeekConfig } from '../../common/types/ISchoolWeekConfig.js';

const SchoolWeekConfigSchema = new Schema<ISchoolWeekConfig>({
    _id: { type: String, required: true },
    daysInWeek: { type: Number, required: true, min: 1, max: 7 }, // e.g., 5 for Mon-Fri
    hoursPerDay: { type: Number, required: true, min: 1, max: 24 }, // e.g., 8 for an 8-hour day
    startHour: { type: Number, required: true, min: 0, max: 23 }, // Starting hour of the schedule
    endHour: { type: Number, required: true, min: 0, max: 23 } // Ending hour of the schedule
});

export const SchoolWeekConfigModel: Model<ISchoolWeekConfig> =
    mongoose.model<ISchoolWeekConfig>(
        'SchoolWeekConfig',
        SchoolWeekConfigSchema,
        'school_week_config'
    );
