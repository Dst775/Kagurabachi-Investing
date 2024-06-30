import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
    userID: { type: mongoose.SchemaTypes.ObjectId, required: true },
    stockID: { type: Number, required: true },
    stockValue: { type: Number, required: true }
});

export const Stock = mongoose.model('Stock', stockSchema);