import { GlobalScheduleModel } from '../models/schedule.model.js';

export const fetchGlobalSchedule = () =>
    GlobalScheduleModel.findOne().sort({ createdAt: -1 });

export const createSchedule = (values: Record<string, any>) =>
    new GlobalScheduleModel(values)
        .save()
        .then((savedSchedule) => savedSchedule.toObject());

export const updateScheduleById = (id: string, values: Record<string, any>) =>
    GlobalScheduleModel.findByIdAndUpdate({ _id: id }, values, {
        new: true,
        runValidators: true
    });

export const deleteScheduleById = (id: string) =>
    GlobalScheduleModel.findByIdAndDelete({ _id: id });
