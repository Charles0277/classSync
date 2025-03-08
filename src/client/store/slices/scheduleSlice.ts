import { IClass } from '@/common/types/IClass';
import {
    IGlobalScheduleEntry,
    IUserScheduleEntry
} from '@/common/types/ISchedule';
import { getIdString } from '@/common/utils';
import { createSlice } from '@reduxjs/toolkit';
import { updateClassSuccess } from './classSlice';

interface scheduleState {
    globalSchedule?: IGlobalScheduleEntry[];
    userSchedule?: IUserScheduleEntry[];
    loading: boolean;
    hasLoaded: boolean;
    generateSemester1Loading?: boolean;
    generateSemester2Loading?: boolean;
    error: string | null;
    popUpEntry?: IUserScheduleEntry | IGlobalScheduleEntry;
    isNewClass?: boolean;
    conflicts?: {
        instructorConflicts: IGlobalScheduleEntry[];
        roomConflicts: IGlobalScheduleEntry[];
        studentConflicts: IGlobalScheduleEntry[];
    };
    checkingConflicts: boolean;
    isScheduleEntryUpdated: boolean;
    isScheduleEntryDeleted: boolean;
    isScheduleEntryAdded: boolean;
}

const initialState: scheduleState = {
    loading: false,
    hasLoaded: false,
    error: null,
    isNewClass: false,
    checkingConflicts: false,
    isScheduleEntryUpdated: false,
    isScheduleEntryDeleted: false,
    isScheduleEntryAdded: false
};

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        getGlobalScheduleRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        getGlobalScheduleSuccess: (state, action) => {
            state.globalSchedule = action.payload;
            state.loading = false;
            state.hasLoaded = true;
        },
        getGlobalScheduleFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        getUserScheduleRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        getUserScheduleSuccess: (state, action) => {
            state.userSchedule = action.payload;
            state.loading = false;
            state.hasLoaded = true;
        },
        getUserScheduleFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        openPopUp: (state, action) => {
            state.popUpEntry = action.payload;
        },
        closePopUp: (state) => {
            state.popUpEntry = undefined;
        },
        setIsNewClass: (state, action) => {
            state.isNewClass = action.payload;
        },
        generateGlobalScheduleRequest: (state, action) => {
            if (action.payload.semester === 1) {
                state.generateSemester1Loading = true;
            } else {
                state.generateSemester2Loading = true;
            }
            state.error = null;
        },
        generateGlobalScheduleSuccess: (state, action) => {
            state.generateSemester1Loading = false;
            state.generateSemester2Loading = false;
        },
        generateGlobalScheduleFailure: (state, action) => {
            state.error = action.payload;
            state.generateSemester1Loading = false;
            state.generateSemester2Loading = false;
        },
        updateGlobalScheduleEntryRequest: (state, action) => {
            state.error = null;
        },
        updateGlobalScheduleEntrySuccess: (state, action) => {
            const updatedEntry = action.payload;
            state.popUpEntry = updatedEntry;
            state.globalSchedule = state.globalSchedule?.map((entry) =>
                entry._id === updatedEntry._id ? updatedEntry : entry
            );
            state.isScheduleEntryUpdated = true;
        },
        updateGlobalScheduleEntryFailure: (state, action) => {
            state.error = action.payload;
        },
        deleteGlobalScheduleEntryRequest: (state, action) => {
            state.error = null;
        },
        deleteGlobalScheduleEntrySuccess: (state, action) => {
            const deletedEntryId = action.payload;
            state.popUpEntry = undefined;
            state.globalSchedule = state.globalSchedule?.filter(
                (entry) => entry.classId !== deletedEntryId
            );
            state.isScheduleEntryDeleted = true;
        },
        deleteGlobalScheduleEntryFailure: (state, action) => {
            state.error = action.payload;
        },
        addGlobalScheduleEntryRequest: (state, action) => {
            state.error = null;
        },
        addGlobalScheduleEntrySuccess: (state, action) => {
            const newEntry = action.payload;
            state.globalSchedule = [...(state.globalSchedule || []), newEntry];
            state.popUpEntry = newEntry;
            state.isNewClass = false;
            state.isScheduleEntryAdded = true;
        },
        addGlobalScheduleEntryFailure: (state, action) => {
            state.error = action.payload;
        },
        checkForConflictsRequest: (state, action) => {
            state.error = null;
            state.checkingConflicts = true;
        },
        checkForConflictsSuccess: (state, action) => {
            const conflicts = action.payload;
            state.conflicts = conflicts.conflicts;
            state.checkingConflicts = false;
        },
        checkForConflictsFailure: (state, action) => {
            state.error = action.payload;
            state.checkingConflicts = false;
        },
        resetScheduleEntryUpdated: (state) => {
            state.isScheduleEntryUpdated = false;
        },
        resetScheduleEntryDeleted: (state) => {
            state.isScheduleEntryDeleted = false;
        },
        resetScheduleEntryAdded: (state) => {
            state.isScheduleEntryAdded = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(updateClassSuccess, (state, action) => {
            const updatedClass = action.payload as IClass;
            if (state.globalSchedule) {
                const updatedGlobalSchedule = state.globalSchedule.map(
                    (entry) =>
                        getIdString(entry.classId) ===
                        getIdString(updatedClass._id)
                            ? {
                                  ...entry,
                                  className: updatedClass.name,
                                  classType: updatedClass.classTypes
                              }
                            : entry
                );
                if (updatedClass.name !== state.popUpEntry?.className) {
                    state.isScheduleEntryUpdated = true;
                }
                state.globalSchedule = updatedGlobalSchedule;
                state.popUpEntry = updatedGlobalSchedule.find(
                    (entry) =>
                        getIdString(entry.classId) ===
                        getIdString(updatedClass._id)
                );
            }
        });
    }
});

export const {
    getGlobalScheduleRequest,
    getGlobalScheduleSuccess,
    getGlobalScheduleFailure,
    getUserScheduleRequest,
    getUserScheduleSuccess,
    getUserScheduleFailure,
    generateGlobalScheduleRequest,
    generateGlobalScheduleSuccess,
    generateGlobalScheduleFailure,
    openPopUp,
    closePopUp,
    updateGlobalScheduleEntryRequest,
    updateGlobalScheduleEntrySuccess,
    updateGlobalScheduleEntryFailure,
    deleteGlobalScheduleEntryRequest,
    deleteGlobalScheduleEntrySuccess,
    deleteGlobalScheduleEntryFailure,
    setIsNewClass,
    addGlobalScheduleEntryRequest,
    addGlobalScheduleEntrySuccess,
    addGlobalScheduleEntryFailure,
    checkForConflictsRequest,
    checkForConflictsSuccess,
    checkForConflictsFailure,
    resetScheduleEntryUpdated,
    resetScheduleEntryDeleted,
    resetScheduleEntryAdded
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
