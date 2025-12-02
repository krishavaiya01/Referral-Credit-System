import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  referralCode: string;
  credits: number;
  hasPurchased: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  referralCode: { type: String, required: true, unique: true, index: true },
  credits: { type: Number, default: 0 },
  hasPurchased: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
