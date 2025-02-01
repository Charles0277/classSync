import { IClass } from '@/common/types/IClass.js';
import { IRoom } from '@/common/types/IRoom.js';
import { IUser } from '@/common/types/IUser.js';
import { getIdString } from '@/common/utils.js';
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

    // Initialise the model with a minimisation objective.
    const model = new Model({
        name: 'class_scheduling_optimised',
        sense: 'min'
    });

    // Create a map to store the decision variables.
    const variableMap = new Map<string, Variable>();

    console.log('Generating optimised model with:', {
        classes: vars.classes.length,
        rooms: vars.rooms.length,
        timeSlots: vars.timeSlots.length
    });

    // Generate variables only for feasible (class, room, time slot) combinations.
    vars.classes.forEach((class_) => {
        // Determine the number of students in this class.
        const numStudents = class_.students.length;

        // Pre-filter rooms that can actually accommodate this class.
        // (Assumes each room object has a 'capacity' property.)
        const feasibleRooms = vars.rooms.filter(
            (room) => room.capacity >= numStudents
        );

        feasibleRooms.forEach((room) => {
            vars.timeSlots.forEach((timeSlot) => {
                const varName = `x_${class_._id}_${room._id}_${timeSlot.day}_${timeSlot.hour}`;

                // Calculate objective coefficient to prefer earlier times.
                // Later times/days incur a higher cost.
                const timeWeight =
                    timeSlot.hour - vars.weekConfig.startHour + 1;
                const dayWeight = timeSlot.day * vars.weekConfig.hoursPerDay;
                const objCoeff = timeWeight + dayWeight;

                // Add the binary variable.
                const variable = model.addVar({
                    name: varName,
                    type: 'binary',
                    obj: objCoeff
                });
                variableMap.set(varName, variable);
            });
        });
    });

    // Constraint 1: Ensure each class is assigned exactly one (room, time slot) combination.
    vars.classes.forEach((class_) => {
        const coeffs: CoefficientList = [];
        const numStudents = class_.students.length;
        const feasibleRooms = vars.rooms.filter(
            (room) => room.capacity >= numStudents
        );

        feasibleRooms.forEach((room) => {
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
                lb: 1,
                ub: 1
            });
        }
    });

    // Constraint 2: Room availability – no more than one class per room per time slot.
    vars.rooms.forEach((room) => {
        vars.timeSlots.forEach((timeSlot) => {
            const coeffs: CoefficientList = [];
            vars.classes.forEach((class_) => {
                // Only consider classes for which this room is feasible.
                if (room.capacity >= class_.students.length) {
                    const varName = `x_${class_._id}_${room._id}_${timeSlot.day}_${timeSlot.hour}`;
                    const variable = variableMap.get(varName);
                    if (variable) {
                        coeffs.push([variable, 1]);
                    }
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

    // Constraint 3: Teacher availability – a teacher cannot be in more than one class at the same time.
    vars.instructors.forEach((instructor) => {
        vars.timeSlots.forEach((timeSlot) => {
            const coeffs: CoefficientList = [];
            vars.classes.forEach((class_) => {
                if (
                    getIdString(class_.instructor) ===
                    getIdString(instructor._id)
                ) {
                    const numStudents = class_.students.length;
                    const feasibleRooms = vars.rooms.filter(
                        (room) => room.capacity >= numStudents
                    );
                    feasibleRooms.forEach((room) => {
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

    // Constraint 4: Student conflicts – a student cannot attend more than one class at the same time.
    vars.students.forEach((student) => {
        vars.timeSlots.forEach((timeSlot) => {
            const coeffs: CoefficientList = [];
            vars.classes.forEach((class_) => {
                // Check if the student is enrolled in this class.
                if (
                    class_.students.some(
                        (id) => getIdString(id) === getIdString(student._id)
                    )
                ) {
                    const numStudents = class_.students.length;
                    const feasibleRooms = vars.rooms.filter(
                        (room) => room.capacity >= numStudents
                    );
                    feasibleRooms.forEach((room) => {
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

    // Update the model so that all variables and constraints are finalised.
    model.update();
    console.log('Optimised model generated successfully');

    return { model, variables: variableMap };
};
