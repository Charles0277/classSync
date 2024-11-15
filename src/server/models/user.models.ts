import mongoose, { Schema, Model, CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../../common/types/IUser.js';

const SALT_WORK_FACTOR = 10;

const UserSchema: Schema<IUser> = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (email: string) => {
                return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
            },
            message: (props) => `${props.value} is not a valid email!`
        }
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    password: { type: String, required: true },
    yearOfStudy: {
        type: Number,
        required: true,
        validate: {
            validator: (yearOfStudy: number) => {
                return yearOfStudy >= 1 && yearOfStudy <= 7;
            },
            message: (props) =>
                `${props.value} is not a valid year of study! It should be between 1 and 7.`
        },
        set: (value: any) => parseInt(value, 10) // Convert to number during assignment
    },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    courseUnits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CourseUnit' }]
});

UserSchema.pre<IUser>('save', async function (next) {
    const user = this as IUser;

    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        next(error as CallbackError);
    }
});

export const UserModel: Model<IUser> = mongoose.model<IUser>(
    'User',
    UserSchema
);
