import dbconnect from "@/lib/dbConnect";
import User  from "@/models/userModel";
import { NextRequest,NextResponse } from "next/server";

dbconnect();
export async function GET(request, { params }) {
    try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
        return NextResponse.json({ error: "Name parameter is required." }, { status: 400 });
    }

    const userExists = await User.findOne({ username: name });

    if (userExists) {
        return NextResponse.json({ exists: true, user: userExists }, { status: 200 });
    }
    return NextResponse.json({ exists: false }, { status: 404 });
} catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
}
}