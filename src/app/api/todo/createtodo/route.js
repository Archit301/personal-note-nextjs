import dbConnect from "@/lib/dbConnect";
import Todo from "@/models/todoModel"; 
import { NextRequest, NextResponse } from "next/server";

dbConnect();  // Ensure MongoDB connection is established

export async function POST(request) {
    try {
      // Parse the incoming request body
      const reqBody = await request.json();  
      const { title, dueDate, userId } = reqBody;
  
      console.log(reqBody);  // Debugging the request body
  
      // Validate input
      if (!title || !userId) {
        return NextResponse.json({ error: 'Title and User ID are required' }, { status: 400 });
      }
  
      // Create the new Todo
      const newTodo = new Todo({
        title,
        dueDate,
        userId,
      });
  
      // Save the Todo to the database
      const savedTodo = await newTodo.save();
  
      // Respond with the saved Todo object
      return NextResponse.json(savedTodo, { status: 201 });
    } catch (error) {
      console.error('Error creating todo:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }