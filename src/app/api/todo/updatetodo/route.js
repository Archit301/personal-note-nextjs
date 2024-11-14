import dbconnect from "@/lib/dbConnect";
import Todo from "@/models/todoModel"; 
import { NextRequest,NextResponse } from "next/server";
dbconnect();


export async function PUT(req) {
  try {
    const reqBody = await req.json();
    const { id, title, dueDate, isCompleted } = reqBody;
     console.log(reqBody)
    // Validate input
    if (!id || !title || !dueDate || isCompleted === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, dueDate, isCompleted },
      { new: true }
    );

    if (!updatedTodo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}