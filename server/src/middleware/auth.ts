import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from "../models/User";
import { BlacklistModel } from '../models/Blacklist';
import CONFIG from '../config';
import { checkToken } from '../utils';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = checkToken(req.headers.authorization);
        if (!token) {
            return res.status(401).json({
                error: 'Token not found',
            });
        }
        const blacktoken = await BlacklistModel.findOne({ token: token });
        if (blacktoken !== null) {
            return res.status(401).json({
                error: 'Invalid authorization token',
            });
        }
        let secret = CONFIG.JWT_SECRET;
        const { _id } = jwt.verify(token, secret) as { _id: string; role: string };

        if (!_id) {
            return res.status(401).json({
                error: 'Not authorized',
            });
        } else {
            let user = await UserModel.findOne({ _id });
            let foundIndex = -1;

            if (!user || foundIndex >= 0) {
                return res.status(401).json({
                    error: 'Not authorized',
                });
            }
            res.locals.user = user;
            next();
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Internal Server Error',
        });
    }
};

export { verifyToken };
