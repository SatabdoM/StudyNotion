const mongoose = require("mongoose");
const OTPSchema = new mongoose.Schema({
    enail: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required:true,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires:5*60,
    }
});

//Function to send email to verify email
async function sendVerificationEmail(email,otp)
{
    try
    {
        const mailResponse = await mailSender(email, "verification email from StudyNotion", otp);
        console.log("Email sent successfully:",mailResponse);
    }
    catch (error)
    {
        console.log("Error occured while sending mails");
        throw error;
    }
};

//Pre-Midleware to save the data on db
OTPSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", OTPSchema);
