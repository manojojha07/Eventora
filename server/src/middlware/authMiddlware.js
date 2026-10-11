 import jwt from 'jsonwebtoken'
 import User from '../models/userModel.js'

//user authentication middleware
 export const protect = async(req, res, next) => {
    let token = req.headers.authorization && req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split('')[1] : null;
if(token){
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if(!req.user){
            return res.status(400).json({
                success:false,
                message:"Not authorized user"
            });
        }
        next();
    }catch(err){
        return res.status(401).json({
            success:false,
            message:"Not autorized, token failed"
        });
    
}} else{
    return res.status(400).json({
        success:false,
        message:"Not autorized, token failed"
    })
}
 }


 export const admin = async(req , res , next) => {
    if(req.user && req.user.role === 'admin'){
        next()
    }
    else{
        return res.status(403).json({
            success:false,
            message:"Forbidden, admin access required"
        })
    }
 }

