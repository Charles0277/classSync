import { createNewClass } from '@/server/controllers/class.js';
import { IClass } from './types/IClass.js';
import { ICourseUnit } from './types/ICourseUnit.js';
import { IRoom } from './types/IRoom.js';
import { IUser } from './types/IUser.js';
import { createClass } from '@/server/services/class.services.js';

export const findFirstDigit = (input: string): string | null => {
    const match = input.match(/\d/);
    return match?.[0] || null;
};

export const findLastDigit = (input: string): string | null => {
    const match = input.match(/\d/g);
    return match?.pop() || null;
};

export const splitCourseUnitIntoClasses = async (
    courseUnit: ICourseUnit,
    students: IUser[],
    room: IRoom
): Promise<IClass[]> => {
    const numberOfClasses = Math.ceil(courseUnit.size / room.capacity);
    const studentsPerClass = Math.ceil(students.length / numberOfClasses);
    const classes: IClass[] = [];

    for (let i = 0; i < numberOfClasses; i++) {
        const classStudents = students.slice(
            i * studentsPerClass,
            (i + 1) * studentsPerClass
        );

        const className = `${courseUnit.name} - ${i + 1}`;
        const semester = findLastDigit(courseUnit.code);

        try {
            const newClass = await createClass({
                name: className,
                courseUnit: courseUnit._id,
                instructor: courseUnit.instructor,
                classTypes: courseUnit.classTypes,
                students: classStudents,
                semester
            });
            classes.push(newClass);
        } catch (error) {
            console.error(`Failed to create class ${className}:`, error);
            throw error;
        }
    }

    return classes;
};
