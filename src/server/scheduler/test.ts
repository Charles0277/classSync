import {
    convertClassTypeToRoomType,
    maxRoomSizeForRoomType,
    splitCourseUnitIntoClasses
} from '@/common/utils.js';
import express from 'express';
import { getClasses } from '../services/class.services.js';
import { getCourseUnits } from '../services/courseUnits.services.js';
import { getRooms } from '../services/room.services.js';
import { getStudents, getTeachers } from '../services/user.services.js';
import { ILPScheduler, generateTimeSlots } from './index.js';
import { IUser } from '@/common/types/IUser.js';

export async function generateSchedules(
    req: express.Request,
    res: express.Response
) {
    try {
        const weekConfig = {
            daysPerWeek: 5,
            hoursPerDay: 9,
            startHour: 9,
            endHour: 18
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
                endHour: 18
            }),
            weekConfig
        });

        // Generate the overarching (global) schedule
        const globalSchedule = await scheduler.generateSchedule();
        console.log(
            'Global Schedule:',
            JSON.stringify(globalSchedule, null, 2)
        );

        return res.status(201).send(globalSchedule);
    } catch (error) {
        console.error('Failed to generate schedule:', error);
        return res.status(500).send({ error: 'Failed to generate schedule' });
    }
}
