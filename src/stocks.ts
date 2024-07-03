import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { decodeJWT, jwtCheck, reqHasBody, isAnyArgUndefined, JwtPayload } from "./auth";
import { Stock } from './schemas/stock';
import { User } from './schemas/user';
import { StockMarket } from './schemas/stockMarket';

export const router = express.Router();

interface ShortenedStock {
    sID: number;
    sVal: number;
};

router.use(cookieParser());
router.use(jwtCheck);

router.get("/", (req, res) => {
    res.json({ msg: "Stock Route" });
});

router.get("/getAll", async (req, res) => {
    const token: JwtPayload = req.user as JwtPayload;
    const stocks = await Stock.find({ userID: token.userID });
    const out: ShortenedStock[] = [];
    stocks.forEach(stock => {
        out.push({ sID: stock.stockID, sVal: stock.stockValue });
    });

    return res.json(out);
});

router.get("/getBalance", async (req, res) => {
    const token: JwtPayload = req.user as JwtPayload;

    return res.json({ msg: "Success", balance: (await User.findById(token.userID))?.balance });
});

router.post("/buyStock", reqHasBody, async (req, res) => {
    if (isAnyArgUndefined(req.body, ["stockID", "buyCount"])) {
        return res.status(401).json({ msg: "Missing Field" });
    }

    const stockID: number = req.body.stockID;
    const buyCount: number = req.body.buyCount;
    const token: JwtPayload = req.user as JwtPayload;
    // More Safety Checks
    if (typeof (stockID) !== 'number' || typeof (buyCount) !== 'number') {
        return res.status(401).json({ msg: "Broken Field" });
    }
    if (stockID < 0 || stockID > 11 || buyCount <= 0) {
        return res.status(401).json({ msg: "Invalid Field" });
    }
    // Get Stock
    const stockData = await StockMarket.findOne({ stockID: stockID });
    if (stockData == null) {
        return res.status(403).json({ msg: "Stock Not Found?" });
    }
    const stockVal = stockData.stockValue;
    // Ensure User has enough Funds
    const userTemp = await User.findOne({ name: token.name });
    if (userTemp == null) {
        return res.status(403).json({ msg: "Something went wrong!" });
    }
    if (userTemp.balance < stockVal * buyCount) {
        return res.status(401).json({ msg: "Not enough Funds" });
    }
    userTemp.balance -= stockVal * buyCount;
    userTemp.save();
    // Safe to buy now
    for (let i = 0; i < buyCount; i++) {
        await Stock.insertMany({
            userID: token.userID,
            stockID: stockID,
            stockValue: stockVal
        });
    }

    return res.json({ msg: `Success.`, balance: userTemp.balance });
});

router.post("/sellStock", reqHasBody, async (req, res) => {
    if (isAnyArgUndefined(req.body, ["stockID", "sellCount"])) {
        return res.status(401).json({ msg: "Missing Field" });
    }

    const stockID: number = req.body.stockID;
    const sellCount: number = req.body.sellCount;
    const token: JwtPayload = req.user as JwtPayload;
    // More Safety Checks
    if (typeof (stockID) !== 'number' || typeof (sellCount) !== 'number') {
        return res.status(401).json({ msg: "Broken Field" });
    }
    if (stockID < 0 || stockID > 11 || sellCount <= 0) {
        return res.status(401).json({ msg: "Invalid Field" });
    }
    // Get Stock
    const stockData = await StockMarket.findOne({ stockID: stockID });
    if (stockData == null) {
        return res.status(403).json({ msg: "Stock Not Found?" });
    }
    const stockVal = stockData.stockValue;
    // Ensure User has enough Stocks
    const userTemp = await User.findOne({ name: token.name });
    if (userTemp == null) {
        return res.status(403).json({ msg: "Something went wrong!" });
    }
    // Stocks owned for this ID only
    const stocksOwned = await Stock.find({ userID: token.userID, stockID: stockID });
    if (stocksOwned.length < sellCount) {
        return res.status(403).json({ msg: "You don't own enough stocks to sell this many!" });
    }

    // Delete Stocks
    for(let i = 0; i < sellCount; i++) {
        await stocksOwned[i].deleteOne();
    }

    userTemp.balance += stockVal * sellCount;
    userTemp.save();

    return res.json({ msg: `Success.`, balance: userTemp?.balance });
});

async function getAllStocksCount(userID: string): Promise<number[]> {
    const stocks = await Stock.find({ userID: userID });
    const counts: number[] = [];
    stocks.forEach(stock => {
        if (counts[stock.stockID] === undefined) {
            counts[stock.stockID] = 0;
        }
        counts[stock.stockID]++;
    });

    return counts;
}