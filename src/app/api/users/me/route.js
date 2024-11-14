import { User } from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import dbconnect from "@/lib/dbConnect";
import { getDataFromToken } from "@/helpers/getDataFromToken";

dbconnect()

export async function GET(NextRequest){
    try {
        const userId=await getDataFromToken(NextRequest)  
        const user=await User.findOne({_id:userId}).select("-password")
        return NextResponse.json({
          message:"User found",
          data:user
        })     
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 400});         
    }
}