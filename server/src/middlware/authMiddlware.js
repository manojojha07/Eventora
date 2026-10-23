//  import jwt from 'jsonwebtoken'
//  import User from '../models/userModel.js'



import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// User authentication middleware
export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if token exists
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token'
            });
        }

        // Extract JWT from "Bearer <token>"
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find authenticated user
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, user not found'
            });
        }

        next();

    } catch (error) {
        console.error('Authentication error:', error.message);

        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed'
        });
    }
};

// Admin authorization middleware
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Forbidden, admin access required'
    });
};










//user authentication middleware
//  export const protect = async(req, res, next) => {
//     let token = req.headers.authorization;
// if(token){
//     try{
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id).select('-password');
//         if(!req.user){
//             return res.status(400).json({
//                 success:false,
//                 message:"Not authorized user"
//             });
//         }
//         next();
//     }catch(err){
//         return res.status(401).json({
//             success:false,
//             message:"Not autorized, token failed"
//         });
    
// }} else{
//     return res.status(400).json({
//         success:false,
//         message:"Not autorized, token failed"
//     })
// }
//  }


//  export const admin = async(req , res , next) => {
//     if(req.user && req.user.role === 'admin'){
//         next()
//     }
//     else{
//         return res.status(403).json({
//             success:false,
//             message:"Forbidden, admin access required"
//         })
//     }
//  }

