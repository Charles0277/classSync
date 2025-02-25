import mongoose, { Model, Schema } from 'mongoose';
import { ISchoolDates } from '../../common/types/ISchoolDates.js';

const SchoolDatesSchema = new Schema<ISchoolDates>(
    {
        _id: { type: String, required: true },
        activity: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true }
    },
    { timestamps: true }
);

export const SchoolDatesModel: Model<ISchoolDates> =
    mongoose.model<ISchoolDates>(
        'SchoolDates',
        SchoolDatesSchema,
        'school_dates'
    );
