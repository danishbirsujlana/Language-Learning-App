"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const Blacklist_1 = require("../models/Blacklist");
const config_1 = __importDefault(require("../config"));
const utils_1 = require("../utils");
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = (0, utils_1.checkToken)(req.headers.authorization);
        if (!token) {
            return res.status(401).json({
                error: 'Token not found',
            });
        }
        const blacktoken = yield Blacklist_1.BlacklistModel.findOne({ token: token });
        if (blacktoken !== null) {
            return res.status(401).json({
                error: 'Invalid authorization token',
            });
        }
        let secret = config_1.default.JWT_SECRET;
        const { _id } = jsonwebtoken_1.default.verify(token, secret);
        if (!_id) {
            return res.status(401).json({
                error: 'Not authorized',
            });
        }
        else {
            let user = yield User_1.UserModel.findOne({ _id });
            let foundIndex = -1;
            if (!user || foundIndex >= 0) {
                return res.status(401).json({
                    error: 'Not authorized',
                });
            }
            res.locals.user = user;
            next();
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Internal Server Error',
        });
    }
});
exports.verifyToken = verifyToken;
