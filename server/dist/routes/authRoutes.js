"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authContoller_1 = require("../controllers/authContoller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/login", authContoller_1.loginUser);
router.post("/verifyotp", authContoller_1.verifyOtp);
router.get("/logout", auth_1.verifyToken, authContoller_1.logOut);
exports.default = router;
