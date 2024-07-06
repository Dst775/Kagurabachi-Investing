import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { jwtCheck, isAnyArgUndefined, reqHasBody } from './auth';
import { StockMarket } from './schemas/stockMarket';
import { User } from './schemas/user';
import { Admin, IAdmin } from './schemas/admin';

export const router = express.Router();
let adminInfo: IAdmin; // Initialize in index.ts

router.use(cookieParser());
router.use(jwtCheck, adminCheckMiddleware);
router.use(express.static("admin"));

router.get("/test", (req, res) => {
    res.json({ msg: adminInfo });
});

router.get("/adminPanel", async (req, res) => {
    return res.json({ canBuyStocks: adminInfo.canBuyStocks });
});

router.get("/turnOffStocks", async (req, res) => {
    adminInfo.canBuyStocks = false;
    adminInfo.save();
    return res.json({ msg: "Success!" });
});


router.get("/turnOnStocks", async (req, res) => {
    adminInfo.canBuyStocks = true;
    adminInfo.save();
    return res.json({ msg: "Success!" });
});

router.post("/updateStocks", reqHasBody, async (req, res) => {
    if (isAnyArgUndefined(req.body, ["stockValues"])) {
        return res.status(401).json({ msg: "Missing Field" });
    }
    const stockValues: number[] = req.body.stockValues;
    if (stockValues.length != (await numberOfStocks())) {
        return res.status(403).json({ msg: "Incorrect number of stocks!" });
    }
    // Put old values into array, load in new values
    const stocks = await StockMarket.find({}).sort({ stockID: 1 });
    for (let i = 0; i < stocks.length; i++) {
        const currentStock = stocks[i];
        currentStock.stockValues.push(currentStock.stockValue);
        currentStock.stockValue += stockValues[i]; // Relative Update
        currentStock.save();
    }

    return res.json({ msg: "Success" });
});

// router.get("/addStocks", async (req, res) => {
//     await User.updateMany({}, { stocks: new Array(12).fill(0) });
//     return res.json({ msg: "Success" });
// });

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

export function canBuyStocks(): boolean {
    if (adminInfo == null) {
        return false;
    }
    return adminInfo.canBuyStocks;
}

export async function loadAdmin() {
    const admin = await Admin.findOne({});
    if (admin == null) {
        throw new Error("Can't load Admin");
    }
    adminInfo = admin;
}

async function numberOfStocks(): Promise<number> {
    const stocks = await StockMarket.countDocuments({});
    return stocks;
}