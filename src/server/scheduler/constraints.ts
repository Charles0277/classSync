import { IClass } from '@/common/types/IClass.js';
import { IRoom } from '@/common/types/IRoom.js';
import { IUser } from '@/common/types/IUser.js';
import { CoefficientList, Model, Variable, loadModule } from 'glpk-ts';

export interface TimeSlot {
    day: number;
    hour: number;
}

export interface SchedulingVariables {
    classes: IClass[];
    rooms: IRoom[];
    instructors: IUser[];
    students: IUser[];
    timeSlots: TimeSlot[];
    weekConfig: {
        daysPerWeek: number;
        hoursPerDay: number;
        startHour: number;
        endHour: number;
    };
}

export const generateModel = async (
    vars: SchedulingVariables
): Promise<{ model: Model; variables: Map<string, Variable> }> => {
    await loadModule();

    // Initialize model
    const model = new Model({
        name: 'class_scheduling',
        sense: 'min' // We want to minimize the objective (earlier times are better)
    });

    // Create variables map to store Variable objects
    const variableMap = new Map<string, Variable>();

    console.log('Generating model with:', {
        classes: vars.classes.length,
        rooms: vars.rooms.length,
        timeSlots: vars.timeSlots.length
    });

    // Add binary variables
    vars.classes.forEach((class_) => {
        vars.rooms.forEach((room) => {
            vars.timeSlots.forEach((timeSlot) => {
                const varName = `x_${class_._id}_${room._id}_${timeSlot.day}_${timeSlot.hour}`;

                // Calculate objective coefficient to prefer earlier times
                // Higher values for later times/days make the solver try to minimize them
                const timeWeight =
                    timeSlot.hour - vars.weekConfig.startHour + 1; // 1-based weight for hours
                const dayWeight = timeSlot.day * vars.weekConfig.hoursPerDay; // Additional weight for later days
                const objCoeff = timeWeight + dayWeight;

                // Create binary variable
                const variable = model.addVar({
                    name: varName,
                    type: 'binary',
                    obj: objCoeff
                });

                variableMap.set(varName, variable);
            });
        });
    });

    // Add each type of constraint...
    // 1. Each class must be assigned exactly once
    vars.classes.forEach((class_) => {
        const coeffs: CoefficientList = [];
        vars.rooms.forEach((room) => {
            vars.timeSlots.forEach((timeSlot) => {
                const varName = `x_${class_._id}_${room._id}_${timeSlot.day}_${timeSlot.hour}`;
                const variable = variableMap.get(varName);
                if (variable) {
                    coeffs.push([variable, 1]);
                }
            });
        });

        if (coeffs.length > 0) {
            model.addConstr({
                name: `class_assigned_once_${class_._id}`,
                coeffs: coeffs,
                ub: 1,
                lb: 1
            });
        }
    });

    // Rest of constraints remain the same...
    // 2. Room capacity constraints (one class per room per time)
    vars.rooms.forEach((room) => {
        vars.timeSlots.forEach((timeSlot) => {
            const coeffs: CoefficientList = [];
            vars.classes.forEach((class_) => {
                const varName = `x_${class_._id}_${room._id}_${timeSlot.day}_${timeSlot.hour}`;
                const variable = variableMap.get(varName);
                if (variable) {
                    coeffs.push([variable, 1]);
                }
            });

            if (coeffs.length > 0) {
                model.addConstr({
                    name: `room_available_${room._id}_${timeSlot.day}_${timeSlot.hour}`,
                    coeffs: coeffs,
                    ub: 1
                });
            }
        });
    });

    // 3. Teacher availability (one class per teacher per time)
    vars.instructors.forEach((instructor) => {
        vars.timeSlots.forEach((timeSlot) => {
            const coeffs: CoefficientList = [];
            vars.classes.forEach((class_) => {
                if (class_.instructor.toString() === instructor._id) {
                    vars.rooms.forEach((room) => {
                        const varName = `x_${class_._id}_${room._id}_${timeSlot.day}_${timeSlot.hour}`;
                        const variable = variableMap.get(varName);
                        if (variable) {
                            coeffs.push([variable, 1]);
                        }
                    });
                }
            });

            if (coeffs.length > 0) {
                model.addConstr({
                    name: `instructor_available_${instructor._id}_${timeSlot.day}_${timeSlot.hour}`,
                    coeffs: coeffs,
                    ub: 1
                });
            }
        });
    });

    // 4. Student conflicts (one class per student per time)
    vars.students.forEach((student) => {
        vars.timeSlots.forEach((timeSlot) => {
            const coeffs: CoefficientList = [];
            vars.classes.forEach((class_) => {
                if (
                    class_.students.some((id) => id.toString() === student._id)
                ) {
                    vars.rooms.forEach((room) => {
                        const varName = `x_${class_._id}_${room._id}_${timeSlot.day}_${timeSlot.hour}`;
                        const variable = variableMap.get(varName);
                        if (variable) {
                            coeffs.push([variable, 1]);
                        }
                    });
                }
            });

            if (coeffs.length > 0) {
                model.addConstr({
                    name: `student_available_${student._id}_${timeSlot.day}_${timeSlot.hour}`,
                    coeffs: coeffs,
                    ub: 1
                });
            }
        });
    });

    // Update model
    model.update();
    console.log('Model generated successfully');

    return { model, variables: variableMap };
};
