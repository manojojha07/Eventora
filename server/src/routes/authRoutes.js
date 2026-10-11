import express from 'express'
import { loginUser, registerUser, verifyOtp } from '../controlllers/authUser.js';

const authRouter = express.Router();

authRouter.post('/register' ,  registerUser);
authRouter.post('/login' ,  loginUser);

authRouter.post('/verify-otp',  verifyOtp);


export default authRouter;