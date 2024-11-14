import dbconnect from "@/lib/dbConnect";
import Todo from "@/models/todoModel"; 
import { NextRequest,NextResponse } from "next/server";
dbconnect();



export async function DELETE(req) {
    try {
        const reqBody = await req.json();


        const { id } = reqBody; // Extract the ID from the request body
        console.log("Deleting todo with ID:", id);

        // Attempt to delete the todo by ID
        const deletedTodo = await Todo.findByIdAndDelete(id);

        // If the todo is not found, return a 404 error
        if (!deletedTodo) {
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
        }

        // If deletion is successful, return a success message
        return NextResponse.json({ message: 'Todo deleted successfully' }, { status: 200 });
    } catch (error) {
        // Handle any internal server errors
        console.error('Error deleting todo:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}