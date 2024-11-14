"use client";
import { useEffect, useState } from "react";
import { useGlobalContext } from "./redux/store"; // Importing global context if needed for authentication

const Home = () => {
  const { state } = useGlobalContext(); // Access context for user data
  const { user, isAuthenticated } = state;
  const [notes, setNotes] = useState([]);
  const [todos, setTodos] = useState([]);
  
  // Fetch notes and todos data based on user ID
  useEffect(() => {
    if (user && user._id) {
      // Fetch recent notes
      fetch(`/api/notes/alltodo/${user._id}`)
        .then((response) => response.json())
        .then((data) => setNotes(data))
        .catch((error) => console.error("Error fetching notes:", error));

      // Fetch recent todos
      fetch(`/api/todo/alltodo/${user._id}`)
        .then((response) => response.json())
        .then((data) => setTodos(data))
        .catch((error) => console.error("Error fetching todos:", error));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Welcome Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Welcome, {user ? user.username : "Guest"}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Your personal notes and to-do dashboard
          </p>
        </div>

        {/* Notes Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-900">Recent Notes</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="p-5 bg-white shadow-lg rounded-lg transform transition-transform hover:scale-105 border-l-4 border-blue-500"
                >
                  <h3 className="text-xl font-bold text-gray-800">{note.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {note.category} - {note.date}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No notes available. Create your first note!</p>
            )}
          </div>
        </div>

        {/* To-Do Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-900">Your To-Do List</h2>
          <ul className="space-y-4">
            {todos.length > 0 ? (
              todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`flex items-center justify-between p-5 bg-white shadow-lg rounded-lg transform transition-transform hover:scale-105 ${
                    todo.completed ? "opacity-50 line-through" : ""
                  }`}
                >
                  <div>
                    <span className="text-lg font-semibold text-gray-800">{todo.task}</span>
                    <span
                      className={`ml-3 inline-block px-3 py-1 text-xs font-semibold rounded ${
                        todo.priority === "High"
                          ? "bg-red-100 text-red-600"
                          : todo.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {todo.priority} Priority
                    </span>
                  </div>
                  <button className="text-blue-500 font-medium hover:text-blue-700">
                    {todo.completed ? "Undo" : "Complete"}
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No tasks available. Add a new task to get started!</p>
            )}
          </ul>
        </div>

        {/* Profile Settings Link */}
        <div className="text-center">
          <a
            href="/settings"
            className="inline-block px-6 py-3 text-white font-semibold bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-all"
          >
            Go to Profile Settings
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
