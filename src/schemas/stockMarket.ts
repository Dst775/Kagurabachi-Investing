import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IStockMarket extends Document {
    stockID: number;
    stockValue: number;
    stockValues: number[];
    stockName: string;
    stockLabel: string;
}

const stockMarketSchema = new mongoose.Schema<IStockMarket>({
    stockID: { type: Number, required: true },
    stockValue: { type: Number, required: true },
    stockValues: { type: [Number], required: true },
    stockName: { type: String, required: true },
    stockLabel: { type: String, required: true }
});

export const StockMarket = mongoose.model<IStockMarket>('StockMarket', stockMarketSchema);