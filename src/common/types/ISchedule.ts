import { Document, Types } from 'mongoose';

export interface IGlobalScheduleEntry {
    _id?: Types.ObjectId;
    classId: String;
    roomId: String;
    day: number;
    hour: number;
    instructorId: String;
    studentIds?: string[];
}

export interface GlobalSchedule {
    entries: {
        [classId: string]: IGlobalScheduleEntry;
    };
}

export interface IIndividualScheduleEntry {
    _id?: Types.ObjectId;
    className: string;
    classType: [];
    day: number;
    hour: number;
    instructorName: string;
    roomName: string;
}

export interface IGlobalSchedule extends GlobalSchedule, Document {}
