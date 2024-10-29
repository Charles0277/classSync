import { RoomModel } from '../models/room.model.js';

export const getRooms = () => RoomModel.find();

export const getRoomByName = (name: string) => RoomModel.findOne({ name });

export const createRoom = (values: Record<string, any>) =>
    new RoomModel(values).save().then((room) => room.toObject());

export const deleteRoomByName = (name: string) =>
    RoomModel.findOneAndDelete({ name });

export const updateRoomByName = (name: string, values: Record<string, any>) =>
    RoomModel.findOneAndUpdate({ name }, values, { new: true });
