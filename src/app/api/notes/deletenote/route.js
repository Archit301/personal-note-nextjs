import dbconnect from "@/lib/dbConnect";
import Note from "@/models/noteModel"; 
import { NextRequest,NextResponse } from "next/server";
dbconnect();

export async function DELETE(request) {
    const reqBody = await request.json();
    const { noteId } = reqBody; // Extract noteId from the request body
  
    console.log(reqBody);
  
    if (!noteId) {
      return NextResponse.json(
        { message: 'Missing noteId' },
        { status: 400 }
      );
    }
  
    try {
      // Find and delete the note with the given noteId
      const deletedNote = await Note.findByIdAndDelete(noteId);
  
      if (!deletedNote) {
        return NextResponse.json(
          { message: 'Note not found' },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { message: 'Note deleted successfully', deletedNote },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error deleting note:', error);
      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }