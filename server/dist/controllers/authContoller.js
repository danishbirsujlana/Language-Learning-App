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
exports.logOut = exports.verifyOtp = exports.loginUser = exports.isNull = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Blacklist_1 = require("../models/Blacklist");
const User_1 = require("../models/User");
const config_1 = __importDefault(require("../config"));
const utils_1 = require("../utils");
function generateOTP() {
    return 111111;
}
const otpStore = {};
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            return res.status(400).json({
                message: 'Phone number is required.',
            });
        }
        const phoneRegex = /^\d{10}$/;
        const isValidPhoneNumber = phoneRegex.test(phoneNumber);
        if (!isValidPhoneNumber) {
            return res.status(400).json({
                message: 'Invalid phone number',
            });
        }
        const otp = generateOTP();
        otpStore[phoneNumber] = otp;
        res.status(200).json({ message: 'OTP sent successfully' });
    }
    catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.loginUser = loginUser;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("object");
    try {
        const { phoneNumber, otp } = req.body;
        if (!phoneNumber) {
            return res.status(400).json({
                message: 'Fields not provided',
            });
        }
        if (otpStore[phoneNumber] && otpStore[phoneNumber] === otp) {
            let user;
            if (phoneNumber) {
                user = yield User_1.UserModel.findOne({ phone: phoneNumber });
            }
            if (user == null) {
                user = new User_1.UserModel();
                if (phoneNumber) {
                    user.phone = phoneNumber;
                }
            }
            yield user.save();
            let sendObject = {
                _id: user._id.toString(),
            };
            let token = generateToken(sendObject, 'accessToken');
            sendObject.accessToken = token;
            if (phoneNumber) {
                delete otpStore[phoneNumber];
            }
            res.status(200).json(sendObject);
        }
        else {
            res.status(400).json({ error: 'Invalid OTP' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.verifyOtp = verifyOtp;
const isNull = (val) => {
    if (val == null || val == 'null' || val == '' || val == undefined || val == 'undefined') {
        return true;
    }
    if (val == 'false' || val === false) {
        return true;
    }
    return false;
};
exports.isNull = isNull;
const generateToken = (userInfo, type = 'accessToken') => {
    return jsonwebtoken_1.default.sign(userInfo, config_1.default.JWT_SECRET, {
        expiresIn: config_1.default.JWT_EXPIRY,
    });
};
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = (0, utils_1.checkToken)(req.headers.authorization);
        if (!token) {
            res.status(401).json({
                error: 'Invalid Token',
            });
        }
        const blackList = new Blacklist_1.BlacklistModel({
            token: token,
        });
        yield blackList.save();
        res.status(200).json({
            message: 'Successfully Logged Out',
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.logOut = logOut;
