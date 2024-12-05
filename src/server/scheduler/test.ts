import { getClasses } from '../services/class.services.js';
import { getRooms } from '../services/room.services.js';
import { getStudents, getTeachers } from '../services/user.services.js';
import { ILPScheduler, generateTimeSlots } from './index.js';

export async function generateSchedules() {
    try {
        const weekConfig = {
            daysPerWeek: 5,
            hoursPerDay: 8,
            startHour: 9,
            endHour: 17
        };

        const [classes, rooms, instructors, students] = await Promise.all([
            getClasses(),
            getRooms(),
            getTeachers(),
            getStudents()
        ]);

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

        const schedules = await scheduler.generateSchedule();
        console.log('Generated Schedules:', schedules);
    } catch (error) {
        console.error('Failed to generate schedule:', error);
    }
}
