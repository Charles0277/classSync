import { fetchCourseById } from '@/server/services/course.services.ts';
import { fetchCourseUnitById } from '@/server/services/courseUnit.services.ts';
import mongoose from 'mongoose';

export function isValidEmail(email: string) {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
}

export const MANCHESTER_EMAIL_REGEX =
    /^[^@\s]+@(student\.)?manchester\.ac\.uk$/;

export const MANCHESTER_EMAIL_ERROR =
    'Please use your @manchester.ac.uk or @student.manchester.ac.uk email address';

export const isValidCourse = async (courseId: string): Promise<boolean> => {
    try {
        const course = await fetchCourseById(courseId);
        return !!course;
    } catch {
        console.log('in catch');
        return false;
    }
};

export const isValidCourseUnits = async (
    courseUnitIds: string[]
): Promise<{ valid: boolean; invalidIds?: string[] }> => {
    try {
        if (!Array.isArray(courseUnitIds)) {
            return { valid: false, invalidIds: [] };
        }

        if (courseUnitIds.length === 0) {
            return { valid: false };
        }

        const invalidFormats = courseUnitIds.filter(
            (id) => !mongoose.Types.ObjectId.isValid(id)
        );

        if (invalidFormats.length > 0) {
            return { valid: false, invalidIds: invalidFormats };
        }

        const existenceChecks = await Promise.all(
            courseUnitIds.map(async (id) => {
                const courseUnit = await fetchCourseUnitById(id);
                return { id, exists: !!courseUnit };
            })
        );

        const nonExistentIds = existenceChecks
            .filter((check) => !check.exists)
            .map((check) => check.id);

        return {
            valid: nonExistentIds.length === 0,
            invalidIds: nonExistentIds
        };
    } catch (error) {
        console.error('Course unit validation error:', error);
        return { valid: false };
    }
};
