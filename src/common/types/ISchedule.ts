import { Document } from 'mongoose';

export interface IGlobalScheduleEntry {
    classId: String;
    roomId: String;
    day: number;
    hour: number;
    instructorId: String;
    studentIds: String[];
}

export interface IGlobalSchedule extends Document {
    entries: IGlobalScheduleEntry[];
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
    entries: IIndividualScheduleEntry[];
}
