import User from "@/models/userModel";
import nodemailer from "nodemailer";
import { uid } from 'uid';

export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    const token = uid(6); 
    
    if (emailType === "VERIFY") {
      //  userId = userId.toString();
      console.log(userId)
   const user=   await User.findByIdAndUpdate (userId, { verifyCode: token, verifyCodeExpiry: Date.now() + 360000 },{ new: true } );
      console.log(user)
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, { forgotPasswordToken: token, forgotPasswordTokenExpiry: Date.now() + 360000 });
    }
    
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "643e83ea98f2e0",
        pass: "932e305ec2e6e7"
      }
    });
    
    const mailOptions = {
      from: 'tambiarchit@gmail.com',
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Your OTP for ${emailType === "VERIFY" ? "email verification" : "password reset"} is ${token}</p>`
    };
    
    await transport.sendMail(mailOptions);
    console.log("Email sent successfully");
    
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
