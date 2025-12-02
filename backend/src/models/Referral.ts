import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type ReferralStatus = 'pending' | 'converted';

export interface IReferral extends Document {
  referrerID: Types.ObjectId;
  referredUserID: Types.ObjectId;
  status: ReferralStatus;
  createdAt: Date;
}

const ReferralSchema = new Schema<IReferral>({
  referrerID: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  referredUserID: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['pending', 'converted'], default: 'pending', index: true },
  createdAt: { type: Date, default: Date.now }
});

ReferralSchema.index({ referrerID: 1, referredUserID: 1 }, { unique: true });

export const Referral: Model<IReferral> = mongoose.models.Referral || mongoose.model<IReferral>('Referral', ReferralSchema);
