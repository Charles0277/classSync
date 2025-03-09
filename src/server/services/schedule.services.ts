import { IGlobalScheduleEntry } from '@/common/types/ISchedule.ts';
import { getIdString } from '@/common/utils.ts';
import mongoose from 'mongoose';
import { GlobalScheduleModel } from '../models/schedule.model.js';

interface InstructorPopulated {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
}

interface ClassPopulated {
    _id: mongoose.Types.ObjectId;
    name: string;
    classTypes: string;
}

interface RoomPopulated {
    _id: mongoose.Types.ObjectId;
    name: string;
}

export const fetchGlobalSchedule = async () => {
    const globalSchedule = await GlobalScheduleModel.aggregate([
        { $match: { _id: 'GLOBAL_SCHEDULE' } },
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
        { $match: { _id: 'GLOBAL_SCHEDULE' } },
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
    GlobalScheduleModel.findOneAndReplace(
        { _id: 'GLOBAL_SCHEDULE' },
        { ...values, _id: 'GLOBAL_SCHEDULE' },
        {
            upsert: true,
            new: true,
            runValidators: true
        }
    ).then((result) => result.toObject());

export const updateScheduleEntryById = (
    id: string,
    values: Record<string, any>
) => {
    const update = { $set: {} as Record<string, any> };

    for (const key in values) {
        update.$set[`entries.${id}.${key}`] = values[key];
    }

    return GlobalScheduleModel.findOneAndUpdate(
        { [`entries.${id}`]: { $exists: true } },
        update,
        {
            new: true,
            runValidators: true,
            projection: { _id: 0, [`entries.${id}`]: 1 }
        }
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
            if (!doc) return null;

            const entry = doc.entries[id] as IGlobalScheduleEntry | undefined;
            if (!entry) return null;

            // Flatten nested IDs and add derived fields
            if (entry.instructorId) {
                const instructor =
                    entry.instructorId as unknown as InstructorPopulated;
                entry.instructorName = `${instructor.firstName} ${instructor.lastName}`;
                entry.instructorId = instructor._id;
            }

            if (entry.roomId) {
                const room = entry.roomId as unknown as RoomPopulated;
                entry.roomName = room.name;
                entry.roomId = room._id;
            }

            if (entry.classId) {
                const classData = entry.classId as unknown as ClassPopulated;
                entry.className = classData.name;
                entry.classType = classData.classTypes as unknown as string[];
                entry.classId = classData._id;
            }

            entry.type = 'global';

            return entry;
        });
};

export const deleteScheduleById = (id: string) =>
    GlobalScheduleModel.findByIdAndDelete({ _id: id });

export const deleteScheduleEntryById = (id: string) =>
    GlobalScheduleModel.findOneAndUpdate(
        { [`entries.${id}`]: { $exists: true } },
        { $unset: { [`entries.${id}`]: 1 } }
    );

export const addScheduleEntry = (values: Record<string, any>) => {
    const classId = values.classId;
    if (!classId) {
        return Promise.reject(new Error('classId is required'));
    }

    return GlobalScheduleModel.findOneAndUpdate(
        {
            _id: 'GLOBAL_SCHEDULE',
            [`entries.${classId}`]: { $exists: false }
        },
        { $set: { [`entries.${classId}`]: values } },
        {
            new: true,
            runValidators: true,
            upsert: true,
            projection: { _id: 0, [`entries.${classId}`]: 1 }
        }
    )
        .populate({
            path: `entries.${classId}.instructorId`,
            select: 'firstName lastName'
        })
        .populate({
            path: `entries.${classId}.roomId`,
            select: 'name'
        })
        .populate({
            path: `entries.${classId}.classId`,
            select: 'name classTypes'
        })
        .lean()
        .exec()
        .then((doc) => {
            if (!doc) return null;

            const entry = doc.entries[classId] as
                | IGlobalScheduleEntry
                | undefined;
            if (!entry) return null;

            // Convert populated documents to flattened fields
            if (entry.instructorId) {
                const instructor =
                    entry.instructorId as unknown as InstructorPopulated;
                entry.instructorName = `${instructor.firstName} ${instructor.lastName}`;
                entry.instructorId = instructor._id;
            }

            if (entry.roomId) {
                const room = entry.roomId as unknown as RoomPopulated;
                entry.roomName = room.name;
                entry.roomId = room._id;
            }

            if (entry.classId) {
                const classData = entry.classId as unknown as ClassPopulated;
                entry.className = classData.name;
                entry.classType = classData.classTypes as unknown as string[];
                entry.classId = classData._id;
            }

            entry.type = 'global';

            return entry;
        });
};

export const checkForConflicts = async (newEntry: IGlobalScheduleEntry) => {
    const existingEntries: IGlobalScheduleEntry[] =
        await GlobalScheduleModel.aggregate([
            { $match: { _id: 'GLOBAL_SCHEDULE' } },
            { $project: { entriesArray: { $objectToArray: '$entries' } } },
            { $unwind: '$entriesArray' },
            { $replaceRoot: { newRoot: '$entriesArray.v' } },
            {
                $match: {
                    day: newEntry.day,
                    hour: newEntry.hour,
                    ...(newEntry.classId && {
                        classId: {
                            $ne: new mongoose.Types.ObjectId(newEntry.classId)
                        }
                    })
                }
            }
        ]);

    return {
        instructorConflicts: existingEntries.filter((e) =>
            e.instructorId.equals(newEntry.instructorId)
        ),
        roomConflicts: existingEntries.filter((e) =>
            e.roomId.equals(newEntry.roomId)
        ),
        studentConflicts: existingEntries.filter((e) =>
            e.studentIds.some((id) =>
                newEntry.studentIds.includes(getIdString(id))
            )
        )
    };
};

export const fetchFriendsSchedule = async (friendIds: string[]) => {
    const friendIdsArray = friendIds.map(
        (id) => new mongoose.Types.ObjectId(id)
    );

    const friendsSchedule = await GlobalScheduleModel.aggregate([
        { $match: { _id: 'GLOBAL_SCHEDULE' } },
        { $match: { entries: { $exists: true } } },
        { $project: { entriesArray: { $objectToArray: '$entries' } } },
        { $unwind: '$entriesArray' },
        { $replaceRoot: { newRoot: '$entriesArray.v' } },
        { $match: { studentIds: { $in: friendIdsArray } } },
        { $addFields: { friendIdsArray: friendIdsArray } },

        {
            $lookup: {
                from: 'users',
                let: {
                    studentIds: '$studentIds',
                    friendIdsArray: '$friendIdsArray'
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $in: ['$_id', '$$studentIds'] },
                                    { $in: ['$_id', '$$friendIdsArray'] }
                                ]
                            }
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
                as: 'friend'
            }
        },
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
            $addFields: {
                className: { $arrayElemAt: ['$class.name', 0] },
                classType: { $arrayElemAt: ['$class.classTypes', 0] },
                roomName: { $arrayElemAt: ['$room.name', 0] },
                friendName: { $arrayElemAt: ['$friend.fullName', 0] }
            }
        },

        {
            $project: {
                classId: 1,
                className: 1,
                classType: 1,
                day: 1,
                hour: 1,
                roomName: 1,
                friendName: 1
            }
        }
    ]);

    return friendsSchedule;
};
