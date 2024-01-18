"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: false },
    phone: { type: Number, required: false },
    email: { type: String, required: false },
    level: { type: Number, default: 0 },
});
const UserModel = (0, mongoose_1.model)('User', userSchema);
exports.UserModel = UserModel;
