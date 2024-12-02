import bcrypt from 'bcrypt';
import mongoose, { CallbackError, Model, Schema, model } from 'mongoose';
import { IUser } from '../../common/types/IUser.js';
import { CourseUnitModel } from './courseUnit.model.js';

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
                const validYears = [1, 2, 3, 4, 5, 7];
                return validYears.includes(yearOfStudy);
            },
            message: (props) =>
                `${props.value} is not a valid year of study! Valid years are 1, 2, 3, 4, 5, and 7.`
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
        const incrementPromises = user.courseUnits.map((courseUnit) =>
            model('CourseUnit').findByIdAndUpdate(
                courseUnit._id,
                [
                    {
                        $set: {
                            size: { $ifNull: ['$size', 0] }
                        }
                    },
                    {
                        $inc: { size: 1 }
                    }
                ],
                { new: true, useFindAndModify: false }
            )
        );

        await Promise.all(incrementPromises);

        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        user.password = await bcrypt.hash(user.password, salt);
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

            // Determine added and removed courseUnits
            const addedCourseUnits = currentCourseUnitsIds.filter(
                (id: string) => !previousCourseUnitsIds.includes(id)
            );
            const removedCourseUnits = previousCourseUnitsIds.filter(
                (id) => !currentCourseUnitsIds.includes(id)
            );

            // Increment size for added courseUnits
            const incrementPromises = addedCourseUnits.map(
                (courseUnitId: string) =>
                    CourseUnitModel.findByIdAndUpdate(
                        courseUnitId,
                        { $inc: { size: 1 } },
                        { new: true, useFindAndModify: false }
                    )
            );

            // Decrement size for removed courseUnits
            // Example of conditional decrement to prevent negative sizes
            const decrementPromises = removedCourseUnits.map((courseUnitId) =>
                CourseUnitModel.findOneAndUpdate(
                    { _id: courseUnitId, size: { $gt: 0 } }, // Only decrement if size > 0
                    { $inc: { size: -1 } },
                    { new: true, useFindAndModify: false }
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
