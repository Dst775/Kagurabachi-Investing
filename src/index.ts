import express, { Request, Response } from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Test Route');
});

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
});
