import dbconnect from "@/lib/dbConnect";
import Todo from "@/models/todoModel"; 
import { NextRequest,NextResponse } from "next/server";
dbconnect();

export async function GET(request, { params }) {
    const { id } =await  params; 
    try {
        const completedTodos = await Todo.find({ userId: id, isCompleted: true });

        console.log("id", id);
        
        // If no completed todos are found, return a 404 response
        if (completedTodos.length === 0) {
            return NextResponse.json({ error: 'No completed todos found' }, { status: 404 });
        }
        
        // Return the completed todos with a 200 status code
        return NextResponse.json(completedTodos, { status: 200 });
    } catch (error) {
        console.error('Error fetching todo:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
  



































