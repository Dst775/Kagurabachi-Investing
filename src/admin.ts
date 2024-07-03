import express, { Request, Response, NextFunction } from 'express';
import { User } from './schemas/user';
import cookieParser from 'cookie-parser';
import { decodeJWT, jwtCheck, isAnyArgUndefined, reqHasBody } from './auth';
import { StockMarket } from './schemas/stockMarket';
import { Stock } from './schemas/stock';

export const router = express.Router();
export let canBuyStocks: boolean = true;

router.use(cookieParser());
router.use(jwtCheck, adminCheckMiddleware);
router.use(express.static("admin"));

router.get("/test", (req, res) => {
    res.json({ msg: req.user });
});

router.get("/adminPanel", async (req, res) => {
    return res.json({ canBuyStocks: canBuyStocks });
});

router.get("/turnOffStocks", (req, res) => {
    canBuyStocks = false;
});


router.get("/turnOnStocks", (req, res) => {
    canBuyStocks = true;
});

// router.get("/wipeStocks", async (req, res) => {
//     await Stock.deleteMany({});
//     return res.json({ msg: "Success" });
// });

function getRandomData(numPoints: number): number[] {
    const data: number[] = [];
    for (let i = 0; i < numPoints; i++) {
        data.push(Math.floor(Math.random() * 101));
    }
    return data;
}

export function adminCheckMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.user;
    console.log(`${req.path}`, token);
    if (token) {
        if (token.name === "EmperorBob") {
            return next();
        }
        return res.status(401).json({ msg: "Unauthorized Access" });
    }
    return res.status(400).json({ msg: "Missing Token" });
}