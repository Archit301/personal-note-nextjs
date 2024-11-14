import { NextResponse } from "next/server";


export async function POST(){
    try {
    const response=NextResponse.json({
        message:"Logout successful",
        success:true
    })   
    response.cookies.set("token","0",{
        httpOnly:true,expires:new Date(0)
     })
     return response 
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });          
    }
}