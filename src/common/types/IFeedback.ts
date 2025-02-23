import { Document, Types } from 'mongoose';

export interface IFeedback extends Document {
    _id: Types.ObjectId;
    type: 'complaint' | 'suggestion' | 'compliment';
    feedback: string;
    user: Types.ObjectId;
}
