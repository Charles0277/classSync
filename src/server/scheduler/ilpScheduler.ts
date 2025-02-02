import { IClass } from '@/common/types/IClass.js';
import { getIdString } from '@/common/utils.js';
import { Variable } from 'glpk-ts';
import { generateModel, SchedulingVariables } from './constraints.js';

// ilpScheduler.types.ts (or at the top of ilpScheduler.ts)
export interface GlobalScheduleEntry {
    classId: string;
    roomId: string;
    day: number;
    hour: number;
    instructorId: string;
    studentIds: string[];
}

export interface GlobalSchedule {
    entries: GlobalScheduleEntry[];
}

export class ILPScheduler {
    private vars: SchedulingVariables;

    constructor(vars: SchedulingVariables) {
        this.vars = vars;
    }

    // Return a GlobalSchedule containing all scheduled class entries
    public async generateSchedule(): Promise<GlobalSchedule> {
        try {
            // Generate the model and variables
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

            // Process the solution into a global schedule
            return this.processSchedule(variables);
        } catch (error) {
            console.error('Error generating schedule:', error);
            throw error;
        }
    }

    private processSchedule(variables: Map<string, Variable>): GlobalSchedule {
        const globalSchedule: GlobalSchedule = { entries: [] };

        console.log('Processing variables for scheduling...');
        console.log('Total variables:', variables.size);

        // Process each variable assignment from the solution
        variables.forEach((variable, varName) => {
            // Only consider variables that are set to 1 (or very close)
            if (Math.abs(variable.valueMIP - 1) < 1e-5) {
                // Variable naming convention: x_{classId}_{roomId}_{day}_{hour}
                const parts = varName.split('_');
                if (parts.length !== 5) {
                    console.warn(`Unexpected variable name format: ${varName}`);
                    return;
                }
                const [_, classId, roomId, day, hour] = parts;
                console.log(`Processing assignment for class ${classId}`);

                // Find the corresponding class object
                const classObj = this.vars.classes.find(
                    (c: IClass) => getIdString(c._id) === classId
                );

                if (classObj) {
                    const instructorId = getIdString(classObj.instructor);
                    const studentIds = classObj.students.map((studentId) =>
                        getIdString(studentId)
                    );

                    const scheduleEntry: GlobalScheduleEntry = {
                        classId,
                        roomId,
                        day: parseInt(day, 10),
                        hour: parseInt(hour, 10),
                        instructorId,
                        studentIds
                    };

                    console.log(
                        'Created global schedule entry:',
                        scheduleEntry
                    );
                    globalSchedule.entries.push(scheduleEntry);
                } else {
                    console.warn(`Warning: Could not find class ${classId}`);
                }
            }
        });

        console.log(
            'Final Global Schedule:',
            JSON.stringify(globalSchedule, null, 2)
        );
        return globalSchedule;
    }
}
