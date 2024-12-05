import { IClass } from '@/common/types/IClass.js';
import { IUser } from '@/common/types/IUser.js';
import { Variable } from 'glpk-ts';
import { Types } from 'mongoose';
import { generateModel, SchedulingVariables } from './constraints.js';

export interface ScheduleEntry {
    classId: string;
    roomId: string;
    day: number;
    hour: number;
}

export interface Schedule {
    userId: string;
    entries: ScheduleEntry[];
}

export class ILPScheduler {
    private vars: SchedulingVariables;

    constructor(vars: SchedulingVariables) {
        this.vars = vars;
    }

    private getIdString(id: string | Types.ObjectId | undefined): string {
        if (!id) return '';
        return id instanceof Types.ObjectId ? id.toString() : id;
    }

    public async generateSchedule(): Promise<Map<string, Schedule>> {
        try {
            // Generate the model
            const { model, variables } = await generateModel(this.vars);

            // First, solve the LP relaxation using simplex
            const simplexResult = model.simplex({
                presolve: true,
                msgLevel: 'all'
            });

            if (simplexResult !== 'ok') {
                throw new Error(
                    `Failed to solve LP relaxation. Return code: ${simplexResult}`
                );
            }

            // Now solve the integer program
            const mipResult = model.intopt({
                presolve: true,
                msgLevel: 'all'
            });

            if (mipResult !== 'ok') {
                throw new Error(
                    `Failed to find optimal solution. Return code: ${mipResult}`
                );
            }

            console.log('MIP Status:', model.statusMIP);
            console.log('Solution Value:', model.valueMIP);

            // Process solution into schedules
            return this.processSchedule(variables);
        } catch (error) {
            console.error('Error generating schedule:', error);
            throw error;
        }
    }

    private processSchedule(
        variables: Map<string, Variable>
    ): Map<string, Schedule> {
        const schedules = new Map<string, Schedule>();

        // Initialize schedules for all users
        [...this.vars.instructors, ...this.vars.students].forEach(
            (user: IUser) => {
                if (
                    user._id &&
                    (typeof user._id === 'string' ||
                        user._id instanceof Types.ObjectId)
                ) {
                    const userId = this.getIdString(user._id);
                    schedules.set(userId, {
                        userId,
                        entries: []
                    });
                    console.log(`Initialized schedule for user: ${userId}`);
                }
            }
        );

        console.log('Processing variables for scheduling...');
        console.log('Total variables:', variables.size);

        // Process all assignments
        variables.forEach((variable, varName) => {
            const value = variable.valueMIP;

            if (value > 0) {
                console.log(`Found assignment: ${varName} = ${value}`);
            }

            // Check if the variable represents an assignment (value close to 1)
            if (Math.abs(value - 1) < 1e-5) {
                const [_, classId, roomId, day, hour] = varName.split('_');
                console.log(`Processing assignment for class ${classId}`);

                const classObj = this.vars.classes.find(
                    (c: IClass) =>
                        this.getIdString(
                            c._id as string | Types.ObjectId | undefined
                        ) === classId
                );

                if (classObj) {
                    const scheduleEntry: ScheduleEntry = {
                        classId,
                        roomId,
                        day: parseInt(day),
                        hour: parseInt(hour)
                    };

                    console.log('Created schedule entry:', scheduleEntry);

                    // Get instructor ID as string
                    const instructorId = this.getIdString(classObj.instructor);
                    console.log('Class instructor ID:', instructorId);

                    // Add to instructor's schedule
                    const instructorSchedule = schedules.get(instructorId);
                    if (instructorSchedule) {
                        instructorSchedule.entries.push(scheduleEntry);
                        console.log(
                            `Added entry to instructor ${instructorId} schedule`
                        );
                    } else {
                        console.log(
                            `Warning: Could not find schedule for instructor ${instructorId}`
                        );
                        console.log('Available schedule keys:', [
                            ...schedules.keys()
                        ]);
                    }

                    // Add to students' schedules
                    classObj.students.forEach((studentId) => {
                        const studentIdStr = this.getIdString(studentId);
                        const studentSchedule = schedules.get(studentIdStr);
                        if (studentSchedule) {
                            studentSchedule.entries.push(scheduleEntry);
                            console.log(
                                `Added entry to student ${studentIdStr} schedule`
                            );
                        } else {
                            console.log(
                                `Warning: Could not find schedule for student ${studentIdStr}`
                            );
                            console.log('Available schedule keys:', [
                                ...schedules.keys()
                            ]);
                        }
                    });
                } else {
                    console.log(`Warning: Could not find class ${classId}`);
                    console.log(
                        'Available classes:',
                        this.vars.classes.map((c) =>
                            this.getIdString(
                                c._id as string | Types.ObjectId | undefined
                            )
                        )
                    );
                }
            }
        });

        // Debug logging for final schedules
        console.log('\nFinal schedules:');
        schedules.forEach((schedule, userId) => {
            console.log(`User ${userId}: ${schedule.entries.length} entries`);
            if (schedule.entries.length > 0) {
                console.log(
                    'Entries:',
                    JSON.stringify(schedule.entries, null, 2)
                );
            }
        });

        return schedules;
    }
}
