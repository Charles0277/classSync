import { IFeedback } from '@/common/types/IFeedback';
import { createSlice } from '@reduxjs/toolkit';

interface feedbackState {
    feedback?: IFeedback;
    feedBackCollection: IFeedback[];
    error?: string | null;
    loading: boolean;
}

const initialState: feedbackState = { loading: false, feedBackCollection: [] };

const feedbackSlice = createSlice({
    name: 'feedback',
    initialState,
    reducers: {
        getAllFeedbackRequest: (state, action) => {
            state.loading = true;
        },
        getAllFeedbackSuccess: (state, action) => {
            state.feedBackCollection = action.payload;
            state.loading = false;
        },
        getAllFeedbackFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        getUserFeedbackRequest: (state, action) => {
            state.loading = true;
        },
        getUserFeedbackSuccess: (state, action) => {
            state.feedBackCollection = action.payload;
            state.loading = false;
        },
        getUserFeedbackFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateFeedbackRequest: (state, action) => {
            state.loading = true;
        },
        updateFeedbackSuccess: (state, action) => {
            state.feedback = action.payload;
            state.loading = false;
        },
        updateFeedbackFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        createFeedbackRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        createFeedbackSuccess: (state, action) => {
            const newFeedback = action.payload;
            state.feedback = newFeedback;
            state.feedBackCollection = [
                newFeedback,
                ...state.feedBackCollection
            ];
            state.loading = false;
        },
        createFeedbackFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteFeedbackRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        deleteFeedbackSuccess: (state, action) => {
            state.loading = false;
            const deletedFeedbackId = action.payload._id;
            state.feedBackCollection = state.feedBackCollection.filter(
                (feedback) => feedback._id !== deletedFeedbackId
            );
            state.loading = false;
        },
        deleteFeedbackFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    getAllFeedbackRequest,
    getAllFeedbackSuccess,
    getAllFeedbackFailure,
    getUserFeedbackRequest,
    getUserFeedbackSuccess,
    getUserFeedbackFailure,
    updateFeedbackRequest,
    updateFeedbackSuccess,
    updateFeedbackFailure,
    createFeedbackRequest,
    createFeedbackSuccess,
    createFeedbackFailure,
    deleteFeedbackRequest,
    deleteFeedbackSuccess,
    deleteFeedbackFailure
} = feedbackSlice.actions;

export default feedbackSlice.reducer;
