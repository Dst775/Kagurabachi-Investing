import express, { Request, Response } from 'express';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { router as AuthRoute, connectToDB } from './auth';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2kb' }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/auth", AuthRoute);

app.get('/', (req: Request, res: Response) => {
    res.send('Test Route');
});

app.listen(PORT, async () => {
    await connectToDB();
    console.log(`Server is running http://localhost:${PORT}`);
});