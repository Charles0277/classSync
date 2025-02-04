import { IGlobalScheduleEntry } from '@/common/types/ISchedule.js';
import { IUser } from '@/common/types/IUser.js';
import { getIdString } from '@/common/utils.js';
import express from 'express';
import { ILPScheduler } from '../scheduler/ilpScheduler.js';
import { generateTimeSlots } from '../scheduler/index.js';
import { getClasses } from '../services/class.services.js';
import { getCourseUnits } from '../services/courseUnits.services.js';
import { getRooms } from '../services/room.services.js';
import {
    createSchedule,
    deleteScheduleById,
    fetchGlobalSchedule
} from '../services/schedule.services.js';
import { getStudents, getTeachers } from '../services/user.services.js';

export const getGlobalSchedule = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const globalSchedule = await fetchGlobalSchedule();
        return res.status(201).send(globalSchedule);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getUserSchedule = async (
    req: express.Request,
    res: express.Response
) => {
    const { id } = req.params;
    try {
        const globalSchedule = await fetchGlobalSchedule();

        const classes = await getClasses();

        const classIdsToFilter = classes
            .filter((cls) =>
                cls.students.some((student) => student.toString() === id)
            )
            .map((cls) => getIdString(cls._id));

        const entriesMap = globalSchedule?.entries as unknown as Map<
            string,
            IGlobalScheduleEntry
        >;
        const userSchedule = Array.from(entriesMap.values()).filter(
            (entry: IGlobalScheduleEntry) =>
                entry.classId &&
                classIdsToFilter.includes(entry.classId.toString())
        );

        return res.status(200).send(userSchedule);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteGlobalSchedule = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const deletedGlobalSchedule = await deleteScheduleById(id);

        return res.status(201).send(deletedGlobalSchedule);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

// export const updateGlobalSchedule = async (
//     req: express.Request,
//     res: express.Response
// ) => {
//     try {
//         const { id } = req.params;

//         const allowedFields = [
//             'name',
//             'courseUnit',
//             'instructor',
//             'classTypes',
//             'students',
//             'semester'
//         ];

//         const invalidFields = Object.keys(req.body).filter(
//             (key) => !allowedFields.includes(key)
//         );

//         if (invalidFields.length > 0) {
//             return res
//                 .status(400)
//                 .send(`Invalid fields: ${invalidFields.join(', ')}`);
//         }

//         const updatedValues = Object.fromEntries(
//             Object.entries(req.body).filter(([_, value]) => value !== undefined)
//         );

//         const updatedClass = await updateClassById(id, updatedValues);

//         return res.status(201).send(updatedClass);
//     } catch (error) {
//         console.log(error);
//         return res.sendStatus(400);
//     }
// };

export async function generateGlobalSchedule(
    req: express.Request,
    res: express.Response
) {
    try {
        const weekConfig = {
            daysPerWeek: 5,
            hoursPerDay: 10,
            startHour: 9,
            endHour: 19
        };

        const [rooms, instructors, students, courseUnits] = await Promise.all([
            getRooms(),
            getTeachers(),
            getStudents(),
            getCourseUnits()
        ]);

        // Helper function to map students to course units efficiently
        const mapStudentsToCourseUnits = (
            students: IUser[]
        ): Map<string, IUser[]> => {
            const map = new Map<string, IUser[]>();
            students.forEach((student) => {
                student.courseUnits.forEach((cuId) => {
                    const id = cuId.toString();
                    if (!map.has(id)) map.set(id, []);
                    map.get(id)!.push(student);
                });
            });
            return map;
        };

        // Optimized caller implementation
        for (const courseUnit of courseUnits) {
            const enrolledStudents =
                mapStudentsToCourseUnits(students).get(
                    courseUnit._id.toString()
                ) || [];
            const classTypes = courseUnit.classTypes;

            if (classTypes.length === 0 || classTypes.length > 2) {
                console.warn(
                    `Course unit ${courseUnit.name} has unsupported number of class types`
                );
                continue;
            }

            // for (const classType of classTypes) {
            //     try {
            //         const roomType = convertClassTypeToRoomType(classType);
            //         const classes = await splitCourseUnitIntoClasses(
            //             courseUnit,
            //             enrolledStudents,
            //             classType,
            //             maxRoomSizeForRoomType(roomType)
            //         );
            //         // Handle created classes
            //     } catch (error) {
            //         console.error(
            //             `Failed to create ${classType} classes for ${courseUnit.name}:`,
            //             error
            //         );
            //     }
            // }
        }

        // Retrieve all classes (after creating them as above)
        const classes = await getClasses();

        const scheduler = new ILPScheduler({
            classes,
            rooms,
            instructors,
            students,
            timeSlots: generateTimeSlots({
                daysPerWeek: 5,
                startHour: 9,
                endHour: 19
            }),
            weekConfig
        });

        // Generate the overarching (global) schedule
        const globalSchedule = await scheduler.generateSchedule();
        createSchedule(globalSchedule);

        return res.status(201).send(globalSchedule);
    } catch (error) {
        console.error('Failed to generate schedule:', error);
        return res.status(500).send({ error: 'Failed to generate schedule' });
    }
}
