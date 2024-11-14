import dbconnect from "@/lib/dbConnect";
import Note from "@/models/noteModel"; 
import { NextRequest,NextResponse } from "next/server";
dbconnect();

export async function POST(request) {
  const reqBody = await request.json();
  const { userId,title, content, category } = reqBody;
  if (!userId || !content || !category) {
    return NextResponse.json(
      { message: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const newNote = new Note({
      userId,
      content,
      category,
      title
    });
    await newNote.save();
    return NextResponse.json(newNote, { status: 200 });
  } catch (error) {
    console.error('Error saving note:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}