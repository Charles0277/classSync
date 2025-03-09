import { createSlice } from '@reduxjs/toolkit';
import { IRoom } from '../../../common/types/IRoom';

interface roomState {
    room?: IRoom;
    rooms: IRoom[];
    loading: boolean;
    error: string | null;
    isRoomAdded: boolean;
    isRoomDeleted: boolean;
    isRoomUpdated: boolean;
}

const initialState: roomState = {
    rooms: [],
    loading: false,
    error: null,
    isRoomAdded: false,
    isRoomDeleted: false,
    isRoomUpdated: false
};

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        fetchAllRoomsRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        fetchAllRoomsSuccess: (state, action) => {
            state.rooms = action.payload;
            state.loading = false;
        },
        fetchAllRoomsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteRoomRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        deleteRoomSuccess: (state, action) => {
            state.loading = false;
            const deletedRoomId = action.payload._id;
            state.rooms = state.rooms.filter(
                (room) => room._id !== deletedRoomId
            );
            state.loading = false;
            state.isRoomDeleted = true;
        },
        deleteRoomFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateRoomRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        updateRoomSuccess: (state, action) => {
            const updatedRoom = action.payload;
            state.rooms = state.rooms.map((room) =>
                room._id === updatedRoom._id ? updatedRoom : room
            );
            state.loading = false;
            state.isRoomUpdated = true;
        },
        updateRoomFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        createRoomRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        createRoomSuccess: (state, action) => {
            const newRoom = action.payload;
            state.room = newRoom;
            state.rooms = [...state.rooms, newRoom];
            state.loading = false;
            state.isRoomAdded = true;
        },
        createRoomFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        resetRoomAdded: (state) => {
            state.isRoomAdded = false;
        },
        resetRoomDeleted: (state) => {
            state.isRoomDeleted = false;
        },
        resetRoomUpdated: (state) => {
            state.isRoomUpdated = false;
        }
    }
});

export const {
    fetchAllRoomsRequest,
    fetchAllRoomsSuccess,
    fetchAllRoomsFailure,
    deleteRoomRequest,
    deleteRoomSuccess,
    deleteRoomFailure,
    updateRoomRequest,
    updateRoomSuccess,
    updateRoomFailure,
    createRoomRequest,
    createRoomSuccess,
    createRoomFailure,
    resetRoomAdded,
    resetRoomDeleted,
    resetRoomUpdated
} = roomSlice.actions;

export default roomSlice.reducer;
