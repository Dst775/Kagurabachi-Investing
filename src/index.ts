import express, { Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit'
import 'dotenv/config';
import { router as AuthRoute, connectToDB } from './auth';
import { router as AdminRoute, loadAdmin } from './admin';
import { getPlayerAdjustmentValue, getStockAdjustedValue, getStockMarketStocksInOrder, router as StockRoute } from './stocks';
import { StockMarket } from './schemas/stockMarket';

const app = express();
const PORT = process.env.PORT || 3000;
const limiter = rateLimit({
    windowMs: 1 * 1000, // 1 second
    limit: 40,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { msg: "Rate Limited." }
});

app.set('view engine', 'ejs');
app.use(limiter);
app.use(express.json({ limit: '1kb' }));
app.use(express.urlencoded({ extended: true }));
app.use("/auth", AuthRoute);
app.use("/admin", AdminRoute);
app.use("/stocks", StockRoute);

app.get('/', (req: Request, res: Response) => {
    res.render("pages/home", {
        auth: { loggedIn: true }
    });
});

app.get('/canon', (req: Request, res: Response) => {
    res.render("pages/canon", {
        auth: { loggedIn: true }
    });
});

app.get('/character', (req: Request, res: Response) => {
    res.render("pages/character", {
        auth: { loggedIn: true }
    });
});

app.get('/investing', (req: Request, res: Response) => {
    res.render("pages/investing", {
        auth: { loggedIn: true }
    });
});

app.get('/ocmaker', (req: Request, res: Response) => {
    res.render("pages/ocmaker", {
        auth: { loggedIn: true }
    });
});

app.get('/ocmaker2', (req: Request, res: Response) => {
    res.render("pages/ocmaker2", {
        auth: { loggedIn: true }
    });
});

app.use(express.static("public"));

app.get("/stockData", async (req, res) => {
    return res.json(await getStockMarketStocksInOrder());
});

app.get("/stockValues", async (req, res) => {
    const stocks = await getStockMarketStocksInOrder();
    const values: number[] = [];
    const playerAdjustmentValue = await getPlayerAdjustmentValue();
    for (let i = 0; i < stocks.length; i++) {
        const stock = stocks[i];
        values.push(await getStockAdjustedValue(stock.stockValue, stock.ownCount, playerAdjustmentValue));
    }
    return res.json({ values: values });
});

app.get("/numChaps", async (req, res) => {
    const stock = await StockMarket.findOne({});
    return res.json({ count: stock?.stockValues.length || 0 });
});

app.listen(PORT, async () => {
    await connectToDB();
    await loadAdmin();
    console.log(`Server is running http://localhost:${PORT}`);
});