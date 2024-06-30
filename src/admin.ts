import express, { Request, Response, NextFunction } from 'express';
import { User } from './schemas/user';
import cookieParser from 'cookie-parser';
import { decodeJWT, jwtCheck, isAnyArgUndefined, reqHasBody } from './auth';
import { StockMarket } from './schemas/stockMarket';
import { Stock } from './schemas/stock';

export const router = express.Router();

router.use(cookieParser());
router.use(jwtCheck, adminCheckMiddleware);
router.use(express.static("admin"));

router.get("/test", (req, res) => {
    res.json({ msg: req.user });
});

router.get("/populateStockMarket", async (req, res) => {
    await StockMarket.insertMany([
        {
            stockID: 0,
            stockValue: 15,
            stockValues: getRandomData(34),
            stockName: "Utagawa Squad",
            stockLabel: "UTG"
        },
        {
            stockID: 1,
            stockValue: 20,
            stockValues: getRandomData(34),
            stockName: "Oji Squad",
            stockLabel: "OJI"
        },
        {
            stockID: 2,
            stockValue: 25,
            stockValues: getRandomData(34),
            stockName: "Kakizaki Squad",
            stockLabel: "KKZ"
        },
        {
            stockID: 3,
            stockValue: 15,
            stockValues: getRandomData(34),
            stockName: "Kitazoe Squad",
            stockLabel: "KTZ"
        },
        {
            stockID: 4,
            stockValue: 15,
            stockValues: getRandomData(34),
            stockName: "Kuruma Squad",
            stockLabel: "KRM"
        },
        {
            stockID: 5,
            stockValue: 15,
            stockValues: getRandomData(34),
            stockName: "Kodera Squad",
            stockLabel: "KDR"
        },
        {
            stockID: 6,
            stockValue: 15,
            stockValues: getRandomData(34),
            stockName: "Suwa Squad",
            stockLabel: "SWA"
        },
        {
            stockID: 7,
            stockValue: 15,
            stockValues: getRandomData(34),
            stockName: "Ninomiya Squad",
            stockLabel: "NMY"
        },
        {
            stockID: 8,
            stockValue: 15,
            stockValues: getRandomData(34),
            stockName: "Mizukami Squad",
            stockLabel: "MZK"
        },
        {
            stockID: 9,
            stockValue: 15,
            stockValues: getRandomData(34),
            stockName: "Murakami Squad",
            stockLabel: "MRK"
        },
        {
            stockID: 10,
            stockValue: 15,
            stockValues: getRandomData(34),
            stockName: "Wakamura Squad",
            stockLabel: "WKM"
        },
        {
            stockID: 11,
            stockValue: 15,
            stockValues: getRandomData(34),
            stockName: "Brian",
            stockLabel: "BRI"
        }
    ]);

    return res.json({msg: "Success"});
});

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