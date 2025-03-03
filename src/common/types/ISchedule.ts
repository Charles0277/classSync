import { Document, Types } from 'mongoose';

export interface InstructorPopulated {
    _id: string;
    firstName: string;
    lastName: string;
}

export interface ClassPopulated {
    _id: string;
    name: string;
    classTypes: string;
}

export interface RoomPopulated {
    _id: string;
    name: string;
}

export interface IGlobalScheduleEntry {
    _id?: Types.ObjectId;
    className: string;
    classType: string;
    day: number;
    hour: number;
    instructorId: string | InstructorPopulated;
    instructorName: string;
    roomId: string | RoomPopulated;
    roomName: string;
    classId: string | ClassPopulated;
    studentIds: string[];
    type: string;
}

export interface GlobalSchedule {
    entries: {
        [classId: string]: IGlobalScheduleEntry;
    };
}

export interface IUserScheduleEntry {
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
