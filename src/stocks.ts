import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { decodeJWT, jwtCheck, reqHasBody, isAnyArgUndefined } from "./auth";
import { Stock } from './schemas/stock';
import { User } from './schemas/user';
import { StockMarket } from './schemas/stockMarket';

export const router = express.Router();

router.use(cookieParser());
router.use(jwtCheck);

router.get("/", (req, res) => {
    res.json({ msg: "Stock Route" });
});

router.get("/getAll", async (req, res) => {
    const token = req.user;

    return res.json(await Stock.find({ userID: token?.userID }));
});

router.get("/getBalance", async (req, res) => {
    const token = req.user;

    return res.json({ msg: "Success", balance: (await User.findById(token?.userID))?.balance });
});

router.post("/buyStock", reqHasBody, async (req, res) => {
    if (isAnyArgUndefined(req.body, ["stockID"])) {
        return res.status(401).json({ msg: "Missing Field" });
    }

    const stockID: number = req.body.stockID;
    const token = req.user;
    // More Safety Checks
    if (typeof (stockID) !== 'number') {
        return res.status(401).json({ msg: "Broken Field" });
    }
    if (stockID < 0 || stockID > 11) {
        return res.status(401).json({ msg: "Invalid Field" });
    }
    // Get Stock
    const stockData = await StockMarket.findOne({ stockID: stockID });
    if (stockData == null) {
        return res.status(403).json({ msg: "Stock Not Found?" });
    }
    const stockVal = stockData.stockValue;
    // Ensure User has enough Funds
    const userTemp = await User.findOne({ name: token?.name });
    if (userTemp == null) {
        return res.status(403).json({ msg: "Something went wrong!" });
    }
    if (userTemp.balance < stockVal) {
        return res.status(401).json({ msg: "Not enough Funds" });
    }
    userTemp.balance -= stockVal;
    userTemp.save();
    // Safe to buy now
    await Stock.insertMany({
        userID: token?.userID,
        stockID: stockID,
        stockValue: stockVal
    });

    return res.json({ msg: `Success.`, balance: userTemp.balance });
});