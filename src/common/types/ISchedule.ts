import { Document, Types } from 'mongoose';

export interface IGlobalScheduleEntry {
    _id?: Types.ObjectId;
    className: string;
    classType: string;
    day: number;
    hour: number;
    instructorName: string;
    roomName: string;
    classId: string;
    studentIds: string[];
    type: string;
}

export interface GlobalSchedule {
    entries: {
        [classId: string]: IGlobalScheduleEntry;
    };
}

export interface IIndividualScheduleEntry {
    _id?: Types.ObjectId;
    className: string;
    classType: string;
    day: number;
    hour: number;
    instructorName: string;
    roomName: string;
    classId: string;
    studentIds?: string[];
}

export interface IGlobalSchedule extends GlobalSchedule, Document {}
