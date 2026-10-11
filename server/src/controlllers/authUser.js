import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendOtpEmail } from "../utils/otpUtils.js";
import OTP from "../models/otpModel.js";


const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}


export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existsUser = await User.findOne({ email });

        if (existsUser) {
            return res.status(400).json({
                success: true,
                message: "User allready exists"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashPassword,
            role: "user",
            isVerified: false
        });
        await user.save();

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`OTP for ${email} : ${otp}`);

        await OTP.create({ email, otp, action: 'account_verification' })

        await sendOtpEmail(email, otp, 'account_verification');


        return res.status(200).json({
            success: true,
            message: "Register successfully, OTP sent to your email.",
            email: user.email
        });

    } catch (error) {
        console.log("error on REGISTER User :) ");
        return res.status(500).json({
            success: false,
            message: "Internal server error  "
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        };

        const salt = await bcrypt.genSalt(10);
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        if (!user.isVerified && user.role === 'user') {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await OTP.deleteMany({ email, action: 'account_verification' });
            await OTP.create({ email, otp, action: 'account_verification' })
            await sendOtpEmail(email, otp, 'account_verification');
            return res.status(400).json({
                success: false,
                message: "Account not verified. A new OTP has been sent to your email"
            });
        }




        return res.status(200).json({
            success: true,
            message: "Login successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        })



    } catch (error) {
        console.log("error on LOGIN User :) ");
        return res.status(500).json({
            success: false,
            message: "Internal server error  "
        })
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpRecord = await OTP.findOne({ email, otp, action: 'account_verification' });

        if (!otpRecord) {
            return res.status(404).json({
                success: false,
                message: "Invalid or expired OTP"
            })
        }
        const user = await User.findOneAndUpdate({ email }, { isVerified: true });
        await OTP.deleteMany({ email, action: 'account_verification' })
        return res.status(400).json({
            success: false,
            message: "Account verified successfully. you can now log in.",
            __id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });

    } catch (error) {
        console.log("error on Verify OTP :) ");
        return res.status(500).json({
            success: false,
            message: "Internal server error  "
        })
    }
}