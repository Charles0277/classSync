import { createSlice } from '@reduxjs/toolkit';
import { ISchoolWeekConfig } from '../../../common/types/ISchoolWeekConfig';
import { IRoom } from '../../../common/types/IRoom';

interface roomState {
    room?: IRoom;
    rooms: IRoom[];
    loading: boolean;
    error: string | null;
}

const initialState: roomState = {
    rooms: [],
    loading: false,
    error: null
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
            state.room = action.payload;
            state.loading = false;
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
            state.rooms = [...state.rooms, ...newRoom];
            state.loading = false;
        },
        createRoomFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
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
    createRoomFailure
} = roomSlice.actions;

export default roomSlice.reducer;
