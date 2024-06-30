import mongoose from 'mongoose';

const stockMarketSchema = new mongoose.Schema({
    stockID: { type: Number, required: true },
    stockValue: { type: Number, required: true },
    stockValues: { type: [Number], required: true },
    stockName: { type: String, required: true },
    stockLabel: { type: String, required: true }
});

export const StockMarket = mongoose.model('StockMarket', stockMarketSchema);