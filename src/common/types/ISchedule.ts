import { Document, Types } from 'mongoose';

export interface IGlobalScheduleEntry {
    _id: Types.ObjectId;
    classId: String;
    roomId: String;
    day: number;
    hour: number;
    instructorId: String;
    studentIds: string[];
}

export interface GlobalSchedule {
    entries: {
        [classId: string]: IGlobalScheduleEntry;
    };
}

export interface IIndividualScheduleEntry {
    name: string;
    day: number;
    hour: number;
    duration: number;
    instructorName: string;
    roomName: string;
}

export interface IIndividualSchedule extends Document {
    entries: {
        [classId: string]: IIndividualScheduleEntry;
    };
}

export interface IGlobalSchedule extends GlobalSchedule, Document {}
