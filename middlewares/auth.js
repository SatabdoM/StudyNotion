const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.auth = async (req, res, next) => {
    try {
        //extract token
        const token = req.cookies.token
                        || req.body.token
            || req.header("Authorization").replace("Bearer ", "");
        
        //if token missing,then return response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is missing',
            });
        }

        //verify the token 
        try {
            const decode = await jwt.verify(token, process.env, JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch (error) {
            //verification status
            return res.status(401).json({
                success: false,
                message: 'token is invalid'
        });
        }
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Something went wrong during validating the token'
        });
    }
}

//isStudent route
exports.isStudent = async (req, res, next) => {
    try {
        // const userDetails=await User.findOne({email})
        if (req.user.accountType !== "Student")
        {
            return res.status(401).json({
              success: false,
              message: "This is a protected route for Student only",
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified, Please try again'
        });
    }
}

//isInstructor route
exports.isStudent = async (req, res, next) => {
    try {
        // const userDetails=await User.findOne({email})
        if (req.user.accountType !== "Instructor")
        {
            return res.status(401).json({
              success: false,
              message: "This is a protected route for Instructor only",
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified, Please try again'
        });
    }
}
//isInstructor route
exports.isStudent = async (req, res, next) => {
    try {
        // const userDetails=await User.findOne({email})
        if (req.user.accountType !== "Admin")
        {
            return res.status(401).json({
              success: false,
              message: "This is a protected route for Admin only",
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified, Please try again'
        });
    }
}
