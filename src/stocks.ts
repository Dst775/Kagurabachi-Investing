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
    const stockData = await StockMarket.findOne({ stockID: stockID });
    const stockVal = stockData?.stockValue;
    // Safe to do now
    await Stock.insertMany({
        userID: token?.userID,
        stockID: stockID,
        stockValue: stockVal
    });

    return res.json({ msg: "Done" });
});