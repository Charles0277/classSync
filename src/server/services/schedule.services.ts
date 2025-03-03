import {
    ClassPopulated,
    IGlobalScheduleEntry,
    InstructorPopulated,
    RoomPopulated
} from '@/common/types/ISchedule.ts';
import mongoose from 'mongoose';
import { GlobalScheduleModel } from '../models/schedule.model.js';

export const fetchGlobalSchedule = async () => {
    const globalSchedule = await GlobalScheduleModel.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 1 },
        { $match: { entries: { $exists: true } } },
        { $project: { entriesArray: { $objectToArray: '$entries' } } },
        { $unwind: '$entriesArray' },
        { $replaceRoot: { newRoot: '$entriesArray.v' } },

        {
            $lookup: {
                from: 'classes',
                let: { classId: '$classId' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$classId'] } } },
                    { $project: { name: 1, classTypes: 1 } }
                ],
                as: 'class'
            }
        },
        {
            $lookup: {
                from: 'rooms',
                let: { roomId: '$roomId' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$roomId'] } } },
                    { $project: { name: 1 } }
                ],
                as: 'room'
            }
        },
        {
            $lookup: {
                from: 'users',
                let: { instructorId: '$instructorId' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$instructorId'] }
                        }
                    },
                    {
                        $project: {
                            fullName: {
                                $concat: ['$firstName', ' ', '$lastName']
                            }
                        }
                    }
                ],
                as: 'instructor'
            }
        },

        {
            $addFields: {
                className: { $arrayElemAt: ['$class.name', 0] },
                classType: { $arrayElemAt: ['$class.classTypes', 0] },
                roomName: { $arrayElemAt: ['$room.name', 0] },
                instructorName: {
                    $arrayElemAt: ['$instructor.fullName', 0]
                },
                type: 'global'
            }
        },

        {
            $project: {
                classId: 1,
                className: 1,
                classType: 1,
                day: 1,
                hour: 1,
                instructorId: 1,
                instructorName: 1,
                roomId: 1,
                roomName: 1,
                studentIds: 1,
                type: 1
            }
        }
    ]);
    return globalSchedule;
};

export const fetchUserSchedule = async (id: string, role: string) => {
    const userId = new mongoose.Types.ObjectId(id);
    const isTeacher = role === 'teacher';

    const userSchedule = await GlobalScheduleModel.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 1 },
        { $match: { entries: { $exists: true } } },
        { $project: { entriesArray: { $objectToArray: '$entries' } } },
        { $unwind: '$entriesArray' },
        { $replaceRoot: { newRoot: '$entriesArray.v' } },
        { $match: { [isTeacher ? 'instructorId' : 'studentIds']: userId } },

        {
            $lookup: {
                from: 'classes',
                let: { classId: '$classId' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$classId'] } } },
                    { $project: { name: 1, classTypes: 1 } }
                ],
                as: 'class'
            }
        },
        {
            $lookup: {
                from: 'rooms',
                let: { roomId: '$roomId' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$roomId'] } } },
                    { $project: { name: 1 } }
                ],
                as: 'room'
            }
        },
        {
            $lookup: {
                from: 'users',
                let: { instructorId: '$instructorId' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$instructorId'] }
                        }
                    },
                    {
                        $project: {
                            fullName: {
                                $concat: ['$firstName', ' ', '$lastName']
                            }
                        }
                    }
                ],
                as: 'instructor'
            }
        },

        {
            $addFields: {
                className: { $arrayElemAt: ['$class.name', 0] },
                classType: { $arrayElemAt: ['$class.classTypes', 0] },
                roomName: { $arrayElemAt: ['$room.name', 0] },
                instructorName: {
                    $arrayElemAt: ['$instructor.fullName', 0]
                }
            }
        },

        {
            $project: {
                classId: 1,
                className: 1,
                classType: 1,
                day: 1,
                hour: 1,
                instructorName: 1,
                roomName: 1,
                ...(role === 'teacher' && { studentIds: 1 })
            }
        }
    ]);
    return userSchedule;
};

export const createSchedule = (values: Record<string, any>) =>
    new GlobalScheduleModel(values)
        .save()
        .then((savedSchedule) => savedSchedule.toObject());

export const updateScheduleById = (id: string, values: Record<string, any>) => {
    const update = { $set: {} as Record<string, any> };

    for (const key in values) {
        update.$set[`entries.${id}.${key}`] = values[key];
    }

    return GlobalScheduleModel.findOneAndUpdate(
        { [`entries.${id}`]: { $exists: true } },
        update,
        { new: true, runValidators: true }
    )
        .populate({
            path: `entries.${id}.instructorId`,
            select: 'firstName lastName'
        })
        .populate({
            path: `entries.${id}.roomId`,
            select: 'name'
        })
        .populate({
            path: `entries.${id}.classId`,
            select: 'name classTypes'
        })
        .lean() // Convert to plain JavaScript object
        .exec()
        .then((doc) => {
            if (doc && doc.entries[id]) {
                const entry: IGlobalScheduleEntry = doc.entries[id];
                // Transform instructor data
                if (entry.instructorId) {
                    entry.instructorName = `${(entry.instructorId as InstructorPopulated).firstName} ${
                        (entry.instructorId as InstructorPopulated).lastName
                    }`;
                }
                // Transform room data
                if (entry.roomId) {
                    entry.roomName = (entry.roomId as RoomPopulated).name;
                }
                // Transform class data
                if (entry.classId) {
                    entry.className = (entry.classId as ClassPopulated).name;
                    entry.classType = (
                        entry.classId as ClassPopulated
                    ).classTypes;
                }
            }
            return doc;
        });
};

export const deleteScheduleById = (id: string) =>
    GlobalScheduleModel.findByIdAndDelete({ _id: id });
