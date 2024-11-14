import dbconnect from "@/lib/dbConnect";
import User  from "@/models/userModel";
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"

dbconnect()

export async function POST(req) {
    try {
      const reqBody = await req.json();
      const { email, password } = reqBody;
      console.log(reqBody);
  
      // Check if user exists
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        return NextResponse.json({ error: "User does not exist" }, { status: 400 });
      }
  
      // Validate password
      const validPassword = await bcryptjs.compare(password, user.password);
      if (!validPassword) {
        return NextResponse.json({ error: "Invalid password" }, { status: 400 });
      }
  
      // Generate JWT token
      const tokenData = {
        _id: user._id,
        username: user.username,
        email: user.email,
      };
      const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });
  
      // Return response with token
      return NextResponse.json({
        message: "Login successful",
        success: true,
        token,
        tokenData
      });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }