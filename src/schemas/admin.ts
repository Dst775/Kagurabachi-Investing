import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAdmin extends Document {
  canBuyStocks: boolean;
}

const adminSchema = new mongoose.Schema<IAdmin>({
    canBuyStocks: { type: Boolean, required: true }
});

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema);