import express from 'express';
import cookieParser from 'cookie-parser';
import { jwtCheck, reqHasBody, isAnyArgUndefined, JwtPayload } from "./auth";
import { User } from './schemas/user';
import { StockMarket } from './schemas/stockMarket';

export const router = express.Router();

router.use(cookieParser());
router.use(jwtCheck);

router.get("/", (req, res) => {
    res.json({ msg: "Stock Route" });
});

router.get("/getAll", async (req, res) => {
    const token: JwtPayload = req.user as JwtPayload;
    const outputStocks = (await User.findById(token.userID))?.stocks || [];
    return res.json(outputStocks);
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
    // Safe to buy now
    userTemp.balance -= stockVal * buyCount;
    userTemp.stocks[stockID] += buyCount;
    userTemp.save();

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
    if (userTemp.stocks[stockID] < sellCount) {
        return res.status(403).json({ msg: "You don't own enough stocks to sell this many!" });
    }
    // Delete Stocks
    userTemp.stocks[stockID] -= sellCount;
    userTemp.balance += stockVal * sellCount;
    userTemp.save();

    return res.json({ msg: `Success.`, balance: userTemp?.balance });
});