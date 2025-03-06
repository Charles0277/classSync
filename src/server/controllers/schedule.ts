import { IUser } from '@/common/types/IUser.js';
import {
    convertClassTypeToRoomType,
    findLastDigit,
    generateTimeSlots,
    maxRoomSizeForRoomType,
    splitCourseUnitIntoClasses
} from '@/common/utils.js';
import express from 'express';
import { ILPScheduler } from '../scheduler/ilpScheduler.js';
import { deleteAllClasses, fetchClasses } from '../services/class.services.js';
import { fetchCourseUnits } from '../services/courseUnit.services.ts';
import { fetchRooms } from '../services/room.services.js';
import {
    addScheduleEntry,
    createSchedule,
    deleteScheduleEntryById,
    fetchGlobalSchedule,
    fetchUserSchedule,
    updateScheduleEntryById
} from '../services/schedule.services.js';
import {
    fetchAllStudents,
    fetchAllTeachers
} from '../services/user.services.js';

export const getGlobalSchedule = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const globalSchedule = await fetchGlobalSchedule();
        return res.status(200).send(globalSchedule);
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
        const userId = req.user?.userId;
        const role = req.user?.userRole;

        if (!userId || !role) {
            return res
                .status(400)
                .send('Missing userId or Role in the request.');
        }

        if (id !== userId && role !== 'admin') {
            return res.status(403).send({ error: 'Unauthorized' });
        }

        const userSchedule = await fetchUserSchedule(id, role);
        return res.status(200).send(userSchedule);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateGlobalScheduleEntry = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const formData = req.body;

        if (!id || !formData) {
            return res.status(400).send({ error: 'Missing id or formData.' });
        }

        const updatedEntry = await updateScheduleEntryById(id, formData);

        if (!updatedEntry) {
            return res
                .status(404)
                .send({ error: 'Entry not found after update' });
        }

        return res.status(200).send(updatedEntry);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteGlobalScheduleEntry = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        await deleteScheduleEntryById(id);

        return res.status(200).send(id);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const addGlobalScheduleEntry = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const formData = req.body;

        if (!formData) {
            return res.status(400).send({ error: 'Missing formData.' });
        }

        if (!formData.classId) {
            return res.status(400).send({ error: 'Missing classId.' });
        }

        const newEntry = await addScheduleEntry(formData);
        return res.status(200).send(newEntry);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export async function generateGlobalSchedule(
    req: express.Request,
    res: express.Response
) {
    try {
        const { semester } = req.body;

        if (typeof semester !== 'number' || semester < 1 || semester > 2) {
            return res.status(400).send({ error: 'Invalid semester' });
        }

        const currentClasses = await fetchClasses();

        if (currentClasses.length > 0) {
            await deleteAllClasses();
        }

        const weekConfig = {
            daysPerWeek: 5,
            hoursPerDay: 10,
            startHour: 9,
            endHour: 19
        };

        const [rooms, instructors, students, courseUnits] = await Promise.all([
            fetchRooms(),
            fetchAllTeachers(),
            fetchAllStudents(),
            fetchCourseUnits()
        ]);

        const courseUnitsOfSemester = courseUnits.filter(
            (courseUnit) =>
                Number(findLastDigit(courseUnit.code)) === semester ||
                Number(findLastDigit(courseUnit.code)) === 0
        );

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
        for (const courseUnit of courseUnitsOfSemester) {
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

            for (const classType of classTypes) {
                try {
                    const roomType = convertClassTypeToRoomType(classType);
                    splitCourseUnitIntoClasses(
                        courseUnit,
                        enrolledStudents,
                        classType,
                        maxRoomSizeForRoomType(roomType),
                        semester as 1 | 2
                    );
                    // Handle created classes
                } catch (error) {
                    console.error(
                        `Failed to create ${classType} classes for ${courseUnit.name}:`,
                        error
                    );
                }
            }
        }

        // Retrieve all classes (after creating them as above)
        const classes = await fetchClasses();

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
