import express from 'express';
import { logOut, loginUser, verifyOtp } from '../controllers/authContoller';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.post("/login", loginUser);
router.post("/verifyotp", verifyOtp);
router.get("/logout", verifyToken, logOut);

export default router;