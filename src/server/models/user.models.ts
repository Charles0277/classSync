import bcrypt from 'bcrypt';
import mongoose, { CallbackError, Model, Schema } from 'mongoose';
import { IUser } from '../../common/types/IUser.js';
import { CourseUnitModel } from './courseUnit.model.js';
import {
    MANCHESTER_EMAIL_ERROR,
    MANCHESTER_EMAIL_REGEX
} from '@/common/validation.js';

const SALT_WORK_FACTOR = 10;

const UserSchema: Schema<IUser> = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            validate: {
                validator: (firstName: string) => {
                    return (
                        /^[a-zA-Z]+$/.test(firstName) &&
                        firstName.length >= 2 &&
                        firstName.length <= 50
                    );
                },
                message: (props) =>
                    `First name must be between 2 and 50 characters and contain only letters`
            }
        },
        lastName: {
            type: String,
            required: true,
            validate: {
                validator: (lastName: string) => {
                    return (
                        /^[a-zA-Z]+$/.test(lastName) &&
                        lastName.length >= 2 &&
                        lastName.length <= 50
                    );
                },
                message: (props) =>
                    `Last name must be between 2 and 50 characters and contain only letters`
            }
        },
        email: {
            type: String,
            required: true,
            unique: true,
            set: (email: string) => email.toLowerCase(),
            validate: {
                validator: (email: string) =>
                    MANCHESTER_EMAIL_REGEX.test(email),
                message: (props) =>
                    `${props.value} is not a valid University of Manchester email address. ${MANCHESTER_EMAIL_ERROR}`
            }
        },
        role: {
            type: String,
            enum: ['student', 'teacher', 'admin'],
            default: 'student'
        },
        password: {
            type: String,
            required: true,
            validate: {
                validator: (password: string) => {
                    return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}/.test(
                        password
                    );
                },
                message: (props) =>
                    `Password must contain at least 8 characters, including uppercase, number, and special character`
            }
        },
        yearOfStudy: {
            type: Number,
            required: true,
            validate: {
                validator: (yearOfStudy: number) => {
                    const validYears = [1, 2, 3, 4, 5, 7];
                    return validYears.includes(yearOfStudy);
                },
                message: (props) =>
                    `${props.value} is not a valid year of study! Valid years are 1, 2, 3, 4, 5, and 7.`
            },
            set: (value: any) => parseInt(value, 10)
        },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        courseUnits: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'CourseUnit' }
        ],
        friends: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }
        ]
    },
    { timestamps: true }
);

UserSchema.pre<IUser>('save', async function (next) {
    const user = this as IUser;

    if (!user.isModified('password')) return next();

    try {
        // First, handle the password hashing
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        user.password = await bcrypt.hash(user.password, salt);

        // Then, increment the size of course units
        if (user.isNew && user.courseUnits?.length > 0) {
            const incrementPromises = user.courseUnits.map((courseUnit) =>
                CourseUnitModel.findByIdAndUpdate(
                    courseUnit._id,
                    { $inc: { size: 1 } },
                    { new: true, useFindAndModify: false }
                )
            );

            await Promise.all(incrementPromises);
        }

        next();
    } catch (error) {
        next(error as CallbackError);
    }
});

UserSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate() as mongoose.UpdateQuery<IUser>;
    const userId = this.getQuery()['_id'];

    try {
        const existingUser = await UserModel.findById(userId).lean();
        if (!existingUser) {
            return next(new Error('User not found'));
        }

        if (update.password) {
            const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
            const hashedPassword = await bcrypt.hash(update.password, salt);
            this.setUpdate({ ...update, password: hashedPassword });
        }

        if (update.courseUnits) {
            const previousCourseUnitsIds = existingUser.courseUnits.map(
                (courseUnit) => courseUnit._id.toString()
            );
            const currentCourseUnitsIds = update.courseUnits.map(
                (courseUnit: string) => courseUnit
            );

            const addedCourseUnits = currentCourseUnitsIds.filter(
                (id: string) => !previousCourseUnitsIds.includes(id)
            );
            const removedCourseUnits = previousCourseUnitsIds.filter(
                (id) => !currentCourseUnitsIds.includes(id)
            );

            const incrementPromises = addedCourseUnits.map(
                (courseUnitId: string) =>
                    CourseUnitModel.findByIdAndUpdate(
                        courseUnitId,
                        { $inc: { size: 1 } },
                        { new: true }
                    )
            );

            const decrementPromises = removedCourseUnits.map((courseUnitId) =>
                CourseUnitModel.findOneAndUpdate(
                    { _id: courseUnitId, size: { $gt: 0 } },
                    { $inc: { size: -1 } },
                    { new: true }
                )
            );

            await Promise.all([...incrementPromises, ...decrementPromises]);
        }

        next();
    } catch (error) {
        next(error as CallbackError);
    }
});

export const UserModel: Model<IUser> = mongoose.model<IUser>(
    'User',
    UserSchema
);
