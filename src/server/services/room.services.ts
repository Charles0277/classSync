import { RoomModel } from '../models/room.model.js';

export const getRooms = () => RoomModel.find();

export const getRoomByName = (name: string) => RoomModel.findOne({ name });

export const createRoom = (values: Record<string, any>) =>
    new RoomModel(values).save().then((room) => room.toObject());

export const deleteRoomById = (id: string) =>
    RoomModel.findByIdAndDelete({ _id: id });

export const updateRoomById = (id: string, values: Record<string, any>) =>
    RoomModel.findByIdAndUpdate({ _id: id }, values, {
        new: true,
        runValidators: true
    });
