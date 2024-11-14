import dbconnect from "@/lib/dbConnect";
import Note from "@/models/noteModel"; 
import { NextRequest,NextResponse } from "next/server";
dbconnect();


export async function PUT(request) {
    const reqBody = await request.json();
    const { noteId,  content, category } = reqBody;
  
    if (!noteId  || !content || !category) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
  
    try {
      // Find the note by `noteId` and update it
      const updatedNote = await Note.findByIdAndUpdate(
        noteId,
        { content, category },
        { new: true } // This option returns the updated document
      );
  
      if (!updatedNote) {
        return NextResponse.json(
          { message: 'Note not found' },
          { status: 404 }
        );
      }
  
      return NextResponse.json(updatedNote, { status: 200 });
    } catch (error) {
      console.error('Error updating note:', error);
      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }