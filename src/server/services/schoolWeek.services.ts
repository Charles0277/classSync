import { SchoolWeekConfigModel } from '../models/schoolWeek.model.js';

const SCHOOL_WEEK_CONFIG_ID = 'schoolWeekConfig'; // Static ID for easy access

export const fetchSchoolWeekConfig = () =>
    SchoolWeekConfigModel.findOne({ _id: SCHOOL_WEEK_CONFIG_ID });

export const initialiseSchoolWeekConfig = (values: Record<string, any>) =>
    new SchoolWeekConfigModel({ _id: SCHOOL_WEEK_CONFIG_ID, ...values })
        .save()
        .then((config) => config.toObject());

export const modifySchoolWeekConfig = (values: Record<string, any>) =>
    SchoolWeekConfigModel.findOneAndUpdate(
        { _id: SCHOOL_WEEK_CONFIG_ID },
        values,
        {
            new: true
        }
    );
