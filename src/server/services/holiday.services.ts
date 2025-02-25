import { HolidayModel } from '../models/holiday.model.ts';

export const fetchHolidays = () => HolidayModel.find();

export const fetchHolidayByName = (name: string) =>
    HolidayModel.findOne({ name });

export const createHoliday = (values: Record<string, any>) =>
    new HolidayModel(values).save().then((holiday) => holiday.toObject());

export const deleteHolidayById = (id: string) =>
    HolidayModel.findByIdAndDelete({ _id: id });

export const updateHolidayById = (id: string, values: Record<string, any>) =>
    HolidayModel.findByIdAndUpdate({ _id: id }, values, {
        new: true,
        runValidators: true
    });
