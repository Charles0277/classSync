import mongoose, { Model, Schema } from 'mongoose';
import {
    IGlobalSchedule,
    IGlobalScheduleEntry
} from '@/common/types/ISchedule.js';

const globalScheduleEntrySchema = new Schema<IGlobalScheduleEntry>({
    classId: { type: Schema.Types.ObjectId, required: true, ref: 'Class' },
    roomId: { type: Schema.Types.ObjectId, required: true, ref: 'Room' },
    day: { type: Number, required: true, min: 0, max: 6 },
    hour: { type: Number, required: true, min: 0, max: 23 },
    instructorId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    studentIds: [{ type: Schema.Types.ObjectId, required: true, ref: 'User' }]
});

const globalScheduleSchema = new Schema<IGlobalSchedule>(
    {
        entries: { type: [globalScheduleEntrySchema], required: true }
    },
    { timestamps: true }
);

export const GlobalScheduleModel: Model<IGlobalSchedule> =
    mongoose.model<IGlobalSchedule>('GlobalSchedule', globalScheduleSchema);
