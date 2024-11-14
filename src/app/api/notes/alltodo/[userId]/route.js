import dbconnect from "@/lib/dbConnect";
import Note from "@/models/noteModel"; 
import { NextRequest,NextResponse } from "next/server";
dbconnect();

export async function GET(request, { params }) {
  const { userId } = await params; 

  if (!userId) {
    return NextResponse.json({ message: "Note ID is required" }, { status: 400 }).limit(5);
  }

  try {
    const note = await Note.find({userId}); 
    if (!note) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }
    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
