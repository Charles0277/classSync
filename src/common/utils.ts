import { Types } from 'mongoose';
import { IClass } from './types/IClass.js';
import { ICourseUnit } from './types/ICourseUnit.js';
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

// Optimized split function
export const splitCourseUnitIntoClasses = async (
    courseUnit: ICourseUnit,
    students: IUser[],
    classType: string,
    maxRoomSize: number
): Promise<IClass[]> => {
    const numberOfClasses = Math.ceil(courseUnit.size / maxRoomSize);
    const studentsPerClass = Math.ceil(students.length / numberOfClasses);
    const semester = findLastDigit(courseUnit.code);

    const createPromises = Array.from({ length: numberOfClasses }, (_, i) => {
        const start = i * studentsPerClass;
        const end = start + studentsPerClass;
        return createClass({
            name: `${courseUnit.name} - ${i + 1}`,
            courseUnit: courseUnit._id,
            instructor: courseUnit.instructor,
            classTypes: classType,
            students: students.slice(start, end),
            semester
        });
    });

    try {
        return await Promise.all(createPromises);
    } catch (error) {
        console.error(
            `Failed to create classes for ${courseUnit.name}:`,
            error
        );
        throw error;
    }
};

// utils.js - Add memoization for expensive functions
const memoize = (fn: (...args: any[]) => any) => {
    const cache = new Map();
    return (...args: any[]) => {
        const key = JSON.stringify(args);
        return cache.has(key)
            ? cache.get(key)
            : (cache.set(key, fn(...args)), cache.get(key));
    };
};

export const convertClassTypeToRoomType = memoize(
    (classType: string): string => {
        switch (classType) {
            case 'workshop':
            case 'seminar':
                return 'classroom';
            default:
                return classType;
        }
    }
);

export const maxRoomSizeForRoomType = memoize((classType: string): number => {
    const sizes = {
        lectureTheatre: 282,
        computerCluster: 70,
        laboratory: 60,
        classroom: 40,
        office: 10
    };
    return sizes[classType as keyof typeof sizes] || 0;
});

export const getIdString = (
    id: string | Types.ObjectId | undefined
): string => {
    if (!id) return '';
    return id instanceof Types.ObjectId ? id.toString() : id;
};
