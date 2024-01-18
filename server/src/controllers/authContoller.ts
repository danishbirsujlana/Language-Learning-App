import jwt from 'jsonwebtoken';
import { BlacklistModel } from '../models/Blacklist';
import { UserModel } from '../models/User';
import CONFIG from '../config';
import { Request, Response } from 'express';
import { checkToken } from '../utils';

function generateOTP(): number {
    return 111111;
}

const otpStore: { [phoneNumber: string]: number } = {};

const loginUser = async (req: Request, res: Response) => {
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
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const verifyOtp = async (req: Request, res: Response) => {
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
                user = await UserModel.findOne({ phone: phoneNumber });
            }
            if (user == null) {
                user = new UserModel();
                if (phoneNumber) {
                    user.phone = phoneNumber;
                }
            }
            await user.save();

            let sendObject: { _id: string; accessToken?: string; } = {
                _id: user._id.toString(),
            };

            let token = generateToken(sendObject, 'accessToken');
            sendObject.accessToken = token;

            if (phoneNumber) {
                delete otpStore[phoneNumber];
            }
            res.status(200).json(sendObject);
        } else {
            res.status(400).json({ error: 'Invalid OTP' });
        }
    } catch (err) {
        // console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const isNull = (val: any) => {
    if (val == null || val == 'null' || val == '' || val == undefined || val == 'undefined') {
        return true;
    }
    if (val == 'false' || val === false) {
        return true;
    }
    return false;
};

const generateToken = (userInfo: any, type = 'accessToken') => {
    return jwt.sign(userInfo, CONFIG.JWT_SECRET, {
        expiresIn: CONFIG.JWT_EXPIRY,
    });
};

const logOut = async (req: Request, res: Response) => {
    try {
        let token = checkToken(req.headers.authorization);
        if (!token) {
            res.status(401).json({
                error: 'Invalid Token',
            });
        }

        const blackList = new BlacklistModel({
            token: token,
        });

        await blackList.save();
        res.status(200).json({
            message: 'Successfully Logged Out',
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { isNull, loginUser, verifyOtp, logOut };