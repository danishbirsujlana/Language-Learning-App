import { model, Schema, Document, Model } from 'mongoose';

interface IUser {
    name?: string;
    phone?: number;
    email?: string;
    level?: number;
}

interface IUserDocument extends IUser, Document { }

const userSchema = new Schema<IUserDocument>({
    name: { type: String, required: false },
    phone: { type: Number, required: false },
    email: { type: String, required: false },
    level: { type: Number, default: 0 },
});

const UserModel: Model<IUserDocument> = model('User', userSchema);

export { UserModel };
