import { getIdString } from '@/common/utils.ts';
import { FeedbackModel } from '../models/feedback.model.ts';

export const fetchFeedback = () => FeedbackModel.find().sort({ updatedAt: -1 });

export const fetchFeedbackById = (id: string) =>
    FeedbackModel.findById({
        _id: id
    });

export const fetchUserFeedback = (userId: string) =>
    FeedbackModel.find({ user: userId }).sort({ updatedAt: -1 });

export const deleteFeedbackById = async (
    id: string,
    userId: string,
    role: string
) => {
    const feedback = await fetchFeedbackById(id);

    if (!feedback) {
        throw new Error('Feedback not found.');
    }

    if (getIdString(feedback.user._id) !== userId && role !== 'admin') {
        throw new Error('Permission denied: You cannot delete this feedback');
    }

    return FeedbackModel.findByIdAndDelete({ _id: id });
};

export const createFeedback = (values: Record<string, any>) =>
    new FeedbackModel(values)
        .save()
        .then((savedFeedback) => savedFeedback.toObject());

export const updateFeedbackById = async (
    id: string,
    userId: string,
    role: string,
    values: Record<string, any>
) => {
    const feedbackEntity = await fetchFeedbackById(id);

    if (!feedbackEntity) {
        throw new Error('Feedback not found');
    }

    if (getIdString(feedbackEntity.user._id) !== userId && role !== 'admin') {
        throw new Error(
            'Permission denied: You cannot update feedback you did not create'
        );
    }

    return FeedbackModel.findByIdAndUpdate({ _id: id }, values, {
        new: true,
        runValidators: true
    });
};
