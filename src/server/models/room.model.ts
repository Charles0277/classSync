import mongoose, { Schema, Model } from 'mongoose';
import { IRoom } from '../../common/types/IRoom.js';

const RoomSchema = new Schema<IRoom>({
    name: { type: String, required: true, unique: true },
    type: {
        type: String,
        enum: ['Lecture Theatre', 'Laboratory', 'Office', 'Computer Cluster'],
        required: true
    },
    capacity: { type: Number, required: true },
    chairs: {
        type: Number,
        required: true
    },
    tables: { type: Number, required: true }
});

export const RoomModel: Model<IRoom> = mongoose.model<IRoom>(
    'Room',
    RoomSchema
);
