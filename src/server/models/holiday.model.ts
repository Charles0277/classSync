import mongoose, { Model, Schema } from 'mongoose';
import { IHoliday } from '../../common/types/IHoliday.ts';

const HolidaySchema = new Schema<IHoliday>(
    {
        name: { type: String, required: true, unique: true },
        startDate: { type: String, required: true },
        endDate: { type: String, required: true }
    },
    { timestamps: true }
);

export const HolidayModel: Model<IHoliday> = mongoose.model<IHoliday>(
    'Holiday',
    HolidaySchema
);
