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

export const generateModel = async (vars: SchedulingVariables) => {
    await loadModule();
    const model = new Model({ name: 'class_scheduling', sense: 'min' });
    const variableMap = new Map<string, Variable>();

    console.log('Generating model with:', {
        classes: vars.classes.length,
        rooms: vars.rooms.length,
        timeSlots: vars.timeSlots.length
    });

    // Precompute all necessary mappings upfront
    const classFeasibleRooms = new Map<string, IRoom[]>();
    const instructorClasses = new Map<string, IClass[]>();
    const studentClasses = new Map<string, IClass[]>();

    vars.classes.forEach((c) => {
        // Convert IDs to strings once
        const classId = getIdString(c._id);
        const instructorId = getIdString(c.instructor);

        // Precompute feasible rooms
        classFeasibleRooms.set(
            classId,
            vars.rooms.filter((r) => r.capacity >= c.students.length)
        );

        // Map instructors to their classes
        instructorClasses.set(instructorId, [
            ...(instructorClasses.get(instructorId) || []),
            c
        ]);

        // Map students to their classes
        c.students.forEach((sId) => {
            const studentId = getIdString(sId);
            studentClasses.set(studentId, [
                ...(studentClasses.get(studentId) || []),
                c
            ]);
        });
    });

    // Variable Generation with precomputed feasible rooms
    vars.classes.forEach((c) => {
        const classId = getIdString(c._id);
        const feasibleRooms = classFeasibleRooms.get(classId) || [];

        feasibleRooms.forEach((room) => {
            vars.timeSlots.forEach((ts) => {
                const varName = `x_${classId}_${getIdString(room._id)}_${ts.day}_${ts.hour}`;
                const timeWeight = ts.hour - vars.weekConfig.startHour + 1;
                const dayWeight = ts.day * vars.weekConfig.hoursPerDay;

                variableMap.set(
                    varName,
                    model.addVar({
                        name: varName,
                        type: 'binary',
                        obj: timeWeight + dayWeight
                    })
                );
            });
        });
    });

    // Optimised Constraints
    // Constraint 1: Each class assigned exactly once
    vars.classes.forEach((c) => {
        const classId = getIdString(c._id);
        const coeffs: CoefficientList = [];

        classFeasibleRooms.get(classId)?.forEach((room) => {
            vars.timeSlots.forEach((ts) => {
                const varName = `x_${classId}_${getIdString(room._id)}_${ts.day}_${ts.hour}`;
                coeffs.push([variableMap.get(varName)!, 1]);
            });
        });

        if (coeffs.length) {
            model.addConstr({
                name: `class_once_${classId}`,
                coeffs,
                lb: 1,
                ub: 1
            });
        }
    });

    // Constraint 2: Room availability
    vars.rooms.forEach((room) => {
        vars.timeSlots.forEach((ts) => {
            const coeffs: CoefficientList = [];
            const roomId = getIdString(room._id);

            vars.classes.forEach((c) => {
                if (
                    classFeasibleRooms
                        .get(getIdString(c._id))
                        ?.some((r) => getIdString(r._id) === roomId)
                ) {
                    const varName = `x_${getIdString(c._id)}_${roomId}_${ts.day}_${ts.hour}`;
                    const variable = variableMap.get(varName);
                    if (variable) coeffs.push([variable, 1]);
                }
            });

            if (coeffs.length) {
                model.addConstr({
                    name: `room_${roomId}_${ts.day}_${ts.hour}`,
                    coeffs,
                    ub: 1
                });
            }
        });
    });

    // Constraint 3: Teacher availability using precomputed map
    instructorClasses.forEach((classes, instructorId) => {
        vars.timeSlots.forEach((ts) => {
            const coeffs: CoefficientList = [];

            classes.forEach((c) => {
                const classId = getIdString(c._id);
                classFeasibleRooms.get(classId)?.forEach((room) => {
                    const varName = `x_${classId}_${getIdString(room._id)}_${ts.day}_${ts.hour}`;
                    const variable = variableMap.get(varName);
                    if (variable) coeffs.push([variable, 1]);
                });
            });

            if (coeffs.length) {
                model.addConstr({
                    name: `teacher_${instructorId}_${ts.day}_${ts.hour}`,
                    coeffs,
                    ub: 1
                });
            }
        });
    });

    // Constraint 4: Student conflicts using precomputed map
    // studentClasses.forEach((classes, studentId) => {
    //     vars.timeSlots.forEach((ts) => {
    //         const coeffs: CoefficientList = [];

    //         classes.forEach((c) => {
    //             const classId = getIdString(c._id);
    //             classFeasibleRooms.get(classId)?.forEach((room) => {
    //                 const varName = `x_${classId}_${getIdString(room._id)}_${ts.day}_${ts.hour}`;
    //                 const variable = variableMap.get(varName);
    //                 if (variable) coeffs.push([variable, 1]);
    //             });
    //         });

    //         if (coeffs.length) {
    //             model.addConstr({
    //                 name: `student_${studentId}_${ts.day}_${ts.hour}`,
    //                 coeffs,
    //                 ub: 1
    //             });
    //         }
    //     });
    // });

    model.update();
    console.log('Optimised model generated successfully');
    return { model, variables: variableMap };
};
