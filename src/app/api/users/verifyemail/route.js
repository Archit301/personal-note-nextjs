import dbconnect from "@/lib/dbConnect";
import { NextRequest,NextResponse } from "next/server";
import  User from "@/models/userModel";


dbconnect();

export async function POST(request){
    try {
        const reqBody = await request.json();
        const { email, verificationCode } = reqBody;
       console.log(verificationCode)
        const user = await User.findOne({ verifyCode:verificationCode });
        if (!user) {
          return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }
    
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save(); 
        return NextResponse.json({
          message: "Email verified successfully",
          success: true
        }, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
}