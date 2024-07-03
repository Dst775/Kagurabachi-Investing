import express, { Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit'
import 'dotenv/config';
import { router as AuthRoute, connectToDB } from './auth';
import { router as AdminRoute } from './admin';
import { router as StockRoute } from './stocks';
import { StockMarket } from './schemas/stockMarket';

const app = express();
const PORT = process.env.PORT || 3000;
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    limit: 75,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { msg: "Rate Limited." }
});

app.use(limiter);
app.use(express.json({ limit: '1kb' }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/auth", AuthRoute);
app.use("/admin", AdminRoute);
app.use("/stocks", StockRoute);

app.get('/', (req: Request, res: Response) => {
    res.send('Test Route');
});

app.get("/stockData", async (req, res) => {
    return res.json(await StockMarket.find({}).sort({ stockID: 1 }));
});

app.listen(PORT, async () => {
    await connectToDB();
    console.log(`Server is running http://localhost:${PORT}`);
});