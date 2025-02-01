import { Types } from 'mongoose';
import { IClass } from './types/IClass.js';
import { ICourseUnit } from './types/ICourseUnit.js';
import { IUser } from './types/IUser.js';

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
    classType: string,
    maxRoomSize: number
): Promise<IClass[]> => {
    const numberOfClasses = Math.ceil(courseUnit.size / maxRoomSize);
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
            // const newClass = await createClass({
            //     name: className,
            //     courseUnit: courseUnit._id,
            //     instructor: courseUnit.instructor,
            //     classTypes: classType,
            //     students: classStudents,
            //     semester
            // });
            // classes.push(newClass);
        } catch (error) {
            console.error(`Failed to create class ${className}:`, error);
            throw error;
        }
    }

    return classes;
};

export const convertClassTypeToRoomType = (classType: string): string => {
    switch (classType) {
        case 'workshop':
            return 'classroom';
        case 'seminar':
            return 'classroom';
        default:
            return classType;
    }
};

export const maxRoomSizeForRoomType = (classType: string): number => {
    switch (classType) {
        case 'lectureTheatre':
            return 282;
        case 'computerCluster':
            return 70;
        case 'laboratory':
            return 60;
        case 'classroom':
            return 40;
        case 'office':
            return 10;
        default:
            return 0;
    }
};

export const getIdString = (
    id: string | Types.ObjectId | undefined
): string => {
    if (!id) return '';
    return id instanceof Types.ObjectId ? id.toString() : id;
};
