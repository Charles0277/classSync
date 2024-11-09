import { createSlice } from '@reduxjs/toolkit';
import { ISchoolWeekConfig } from '../../../common/types/ISchoolWeekConfig';
import { IRoom } from '../../../common/types/IRoom';

interface roomState {
    room?: IRoom;
    rooms?: IRoom[];
    loading: boolean;
    error: string | null;
}

const initialState: roomState = {
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
        }
        // updateRoomRequest: (state, action) => {
        //     state.loading = true;
        //     state.error = null;
        // },
        // updateRoomSuccess: (state, action) => {
        //     state.schoolWeekRoom = action.payload;
        //     state.loading = false;
        // },
        // updateRoomFailure: (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        // }
    }
});

export const {
    fetchAllRoomsRequest,
    fetchAllRoomsSuccess,
    fetchAllRoomsFailure
} = roomSlice.actions;

export default roomSlice.reducer;
