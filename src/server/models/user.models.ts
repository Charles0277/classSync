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
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
            },
            message: (props) => `${props.value} is not a valid email!`
        }
    },
    authentication: {
        salt: { type: String },
        password: { type: String, required: true }
    }
});

UserSchema.pre<IUser>('save', async function (next) {
    const user = this as IUser;

    if (!user.isModified('authentication')) return next();

    try {
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        user.authentication.salt = salt;
        user.authentication.password = await bcrypt.hash(
            user.authentication.password,
            salt
        );
        next();
    } catch (error) {
        next(error as CallbackError);
    }
});

const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
