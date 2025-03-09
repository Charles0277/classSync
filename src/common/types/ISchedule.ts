import { Document, Types } from 'mongoose';

export interface IGlobalScheduleEntry {
    _id?: Types.ObjectId;
    className: string;
    classType: string[];
    day: number;
    hour: number;
    instructorId: Types.ObjectId;
    instructorName: string;
    roomId: Types.ObjectId;
    roomName: string;
    classId: Types.ObjectId;
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
    classType: string[];
    day: number;
    hour: number;
    instructorName: string;
    roomName: string;
    classId: string;
    studentIds?: string[];
}

export interface IFriendsScheduleEntry {
    _id?: Types.ObjectId;
    className: string;
    classType: string[];
    day: number;
    hour: number;
    roomName: string;
    friendName?: string;
}

export interface IGlobalSchedule extends GlobalSchedule, Document {}
