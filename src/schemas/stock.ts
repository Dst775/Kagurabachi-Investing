import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
    userID: mongoose.SchemaTypes.ObjectId,
    stockID: Number,
    stockValue: Number
});

export const Stock = mongoose.model('Stock', stockSchema);