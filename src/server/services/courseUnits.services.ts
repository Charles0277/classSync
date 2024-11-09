import { CourseUnitModel } from '../models/courseUnit.model.js';
import { RoomModel } from '../models/room.model.js';

export const getCourseUnitsByCourse = (course: string) =>
    CourseUnitModel.find({
        code: { $regex: `^${course}`, $options: 'i' }
    });
export const getRoomByName = (name: string) => RoomModel.findOne({ name });

export const createRoom = (values: Record<string, any>) =>
    new RoomModel(values).save().then((room) => room.toObject());

export const deleteRoomByName = (name: string) =>
    RoomModel.findOneAndDelete({ name });

export const updateRoomByName = (name: string, values: Record<string, any>) =>
    RoomModel.findOneAndUpdate({ name }, values, { new: true });
