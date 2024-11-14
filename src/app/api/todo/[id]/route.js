import dbconnect from "@/lib/dbConnect";
import Todo from "@/models/todoModel"; 
import { NextRequest,NextResponse } from "next/server";
dbconnect();

export async function GET(request, { params }) {
    const { id } =await  params; // Extract the 'id' from the 'params' object
    try {
        // Find the todo by its ID
        const todo = await Todo.find({userId:id});
        console.log("id",id)
        // If the todo is not found, return a 404 response
        if (!todo) {
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
        }
    
        // Return the todo with a 200 status code
        return NextResponse.json(todo, { status: 200 });
    } catch (error) {
        console.error('Error fetching todo:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
  