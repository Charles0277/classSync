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

export async function generateSchedules(
    req: express.Request,
    res: express.Response
) {
    try {
        const weekConfig = {
            daysPerWeek: 5,
            hoursPerDay: 8,
            startHour: 9,
            endHour: 17
        };

        const [rooms, instructors, students, courseUnits] = await Promise.all([
            getRooms(),
            getTeachers(),
            getStudents(),
            getCourseUnits()
        ]);

        // Replace forEach with a for…of loop to properly await asynchronous operations
        for (const courseUnit of courseUnits) {
            const enrolledStudents = students.filter((student) =>
                student.courseUnits.includes(courseUnit._id as any)
            );

            if (courseUnit.classTypes.length === 1) {
                const classType = courseUnit.classTypes[0];
                const roomType = convertClassTypeToRoomType(classType);
                const maxRoomSize = maxRoomSizeForRoomType(roomType);

                try {
                    const classes = await splitCourseUnitIntoClasses(
                        courseUnit,
                        enrolledStudents,
                        classType,
                        maxRoomSize
                    );
                    // Handle the created classes as needed (e.g. persist to database)
                } catch (error) {
                    console.error(
                        `Failed to create classes for ${courseUnit.name}:`,
                        error
                    );
                }
            } else if (courseUnit.classTypes.length === 2) {
                for (const classType of courseUnit.classTypes) {
                    const roomType = convertClassTypeToRoomType(classType);
                    const maxRoomSize = maxRoomSizeForRoomType(roomType);

                    try {
                        const classes = await splitCourseUnitIntoClasses(
                            courseUnit,
                            enrolledStudents,
                            classType,
                            maxRoomSize
                        );
                        // Handle the created classes for each classType as needed
                    } catch (error) {
                        console.error(
                            `Failed to create classes for ${courseUnit.name} with class type ${classType}:`,
                            error
                        );
                    }
                }
            } else {
                console.warn(
                    `Course unit ${courseUnit.name} has an unsupported number of class types.`
                );
            }
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
                endHour: 17
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
