import { TimeSlot } from './constraints.js';
export { generateModel } from './constraints.js';
export type { SchedulingVariables, TimeSlot } from './constraints.js';
export { ILPScheduler } from './ilpScheduler.js';

// Helper function to generate time slots
export function generateTimeSlots(weekConfig: {
    daysPerWeek: number;
    startHour: number;
    endHour: number;
}): TimeSlot[] {
    const slots: TimeSlot[] = [];
    for (let day = 0; day < weekConfig.daysPerWeek; day++) {
        for (
            let hour = weekConfig.startHour;
            hour < weekConfig.endHour;
            hour++
        ) {
            slots.push({ day, hour });
        }
    }
    return slots;
}
