import { IFeedback } from '@/common/types/IFeedback.ts';
import mongoose, { Model, Schema } from 'mongoose';

const feedbackSchema = new Schema<IFeedback>(
    {
        type: {
            type: String,
            enum: ['complaint', 'suggestion', 'compliment'],
            required: true
        },
        feedback: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

export const FeedbackModel: Model<IFeedback> = mongoose.model<IFeedback>(
    'Feedback',
    feedbackSchema,
    'feedback'
);
