import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User } from './schemas/user';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

export const router = express.Router();
export interface JwtPayload {
    name: string;
    userID: string;
};
const SALT_ROUNDS = 10;

router.use(cookieParser());

router.get("/", (req, res) => {
    res.json({ msg: "Auth Route" });
});

router.post("/register", bodyCheck, async (req, res) => {
    const inputs = req.body;
    if (isAnyArgUndefined(inputs, ["name", "password"])) {
        return res.status(401).json({ msg: "Missing Field" });
    }
    // Unique Username and Valid Email
    let nameAlreadyUsed = await User.findOne({ name: inputs.name });
    if (nameAlreadyUsed !== null) {
        return res.status(403).json({ msg: "Failed - Name Taken" });
    }
    // Valid Details, Create User
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    const hashedPassword = bcrypt.hashSync(inputs.password, salt);
    await User.insertMany({
        name: inputs.name,
        password: hashedPassword
    });
    return res.status(201).json({ msg: "Success" });
});

router.post("/login", bodyCheck, async (req, res) => {
    const inputs = req.body;
    if (isAnyArgUndefined(inputs, ["name", "password"])) {
        return res.status(401).json({ msg: "Missing Field" });
    }
    // Check if user is in DB
    const user = await User.findOne({ name: inputs.name });
    if (user == null) {
        return res.status(404).json({ msg: "No user with that name" });
    }
    // Password Check
    if (bcrypt.compareSync(inputs.password, user.password as string)) {
        const payload: JwtPayload = { userID: user._id.toString(), name: user.name as string };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "7d" });
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 Days
            secure: true
        });

        return res.status(200).json({ msg: "Success" });
    }
    return res.status(401).json({ msg: "Incorrect Password" });
});

router.get("/cookie", jwtCheck, (req, res) => {
    const token = req.user;
    return res.send(`Welcome ${token?.name}`);
});

export async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("connected");
    } catch (e) {
        console.log(e.message);
    }
}

function bodyCheck(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
        return res.status(400).json({ msg: "Missing Request Body" });
    }
    next();
}

/**
 * Must check if the returned value is null or not
 * @param token 
 * @returns Return the JwtPayload if valid otherwise null
 */
function decodeJWT(token: string): JwtPayload | null {
    try {
        // Verify the JWT
        return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch (ex) {
        return null;
    }
}

function jwtCheck(req: Request, res: Response, next: NextFunction) {
    const token: string | undefined = req.cookies.token;
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
    const jwtToken = decodeJWT(token);
    if (jwtToken === null) {
        return res.status(400).send("Invalid Token");
    }
    req.user = jwtToken;
    next();
}

function isAnyArgUndefined(inputs: object, argList: string[]) {
    for (const arg of argList) {
        if (inputs[arg] === undefined) {
            return true;
        }
    }
    return false;
}