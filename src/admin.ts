import express, { Request, Response, NextFunction } from 'express';
import { User } from './schemas/user';
import cookieParser from 'cookie-parser';
import { decodeJWT, jwtCheck, isAnyArgUndefined, reqHasBody } from './auth';

export const router = express.Router();

router.use(cookieParser());
router.use(jwtCheck, adminCheckMiddleware);
router.use(express.static("admin"));

router.get("/test", (req, res) => {
    res.json({ msg: req.user });
});

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