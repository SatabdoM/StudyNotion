//otp send
const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//-------------------------------------------------------------------------------

//                                    OTP GENERATION PART

//-------------------------------------------------------------------------------

//sendOTP
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from request body
    const { email } = req.body;

    //checvk if user already exists
    const checkUserPresent = await User.findOne({ email });

    //if user already exists
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }
    //Notun OTP generate korlam ekhane otp generator diye
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generated :", otp);

    //check if unique otp or not: 
    //Until we are getting an unique otp we are generating new otp
    const result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    //Creating the OTP object to insert to the database
    const otpPayload = { email, otp };

    //Create an entry  for OTP in Database
    const otpBody = OTP.create(otpPayload);
    console.log(otpBody);


    //return response successful
    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//-------------------------------------------------------------------------------

//                                    SIGNUP PART

//-------------------------------------------------------------------------------
exports.signUp = async (req, res) => {
    //data fetch from request ki body
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
      } = req.body;
      
        //validate kore ne ki shob field e value ache naki
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp)
        {
            return res.status(403).json({
                success: false,
                message:"All fields are required"
            })
      }
      

        //2 password match krlo password and confirm password
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password values does not match,please try again'
            });
      }
      

        //check user already exists or not 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User is already registered',
            });
      }
      

        //find most recent OTP stored for the user
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
      console.log(recentOtp);
      

        //validate OTP
        if(recentOtp.length==0)
        {
            //OTP not found
            return res.status(400).json({
                success:false,
                message:'OTP Found'
            })
        }
        else if (otp !== recentOtp.otp) {
            //Invalid OTP
            return res.status(400).json({
                success:false,
                message:'Invalid OTP',
            })
      }
      

        //hash password or encrypted password
        const hasedPassword = await bcrypt.hash(password,10);
    
        //entry create in DB
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });
    
      const user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password: hasedPassword,
        accountType,
        additionalDetails: profileDetails._id,
        image: `http://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastName}`,
    
      });


      return res.status(200).json({
        success: true,
        message: "User is registered successfully",
        user,
      });
  }
    catch(error)
    {
      console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered. Please try again",
        })

    }

}


//-------------------------------------------------------------------------------

//                                    LOGIN PART

//-------------------------------------------------------------------------------

//Login
exports.login = async (req, res) => {
  try {
    //get the data from request body
    const { email, password } = req.body;
    //validate data
    if (!email, password) {
      return res.status(403).json({
        success: false,
        message: 'All fields are required please try again',
      });
    }
    //user check exists or not
    const user = await User.findOne({ email }.populate("additionalDetails"));
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not registered, please signup first',
      });
    }
    //generate JWT after pasword matching
    if (await bcrypt.compare(password, user.password))
    {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      //create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly:true,
      }
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });

    }
    else {
      return res.status(401).json({
        success: false,
        message: 'Password is Incorrect'
      });
    }
    
  }
  catch (error) {
    console.error(500).json({
      success: false,
      message: 'Login Failure, Please try again'
    });
  }
}
//-------------------------------------------------------------------------------

//                                    CHANGE PASSWORD PART

//-------------------------------------------------------------------------------

//changepassword
exports.changePassword = async (req, res) => {
  //get data from req body
  //get oldPassword, NewPassword ,confirmPassword
  //validation
  
}