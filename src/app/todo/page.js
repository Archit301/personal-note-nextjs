"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../redux/store";

const TodoPage = () => {
  const { state } = useGlobalContext();
  const { user } = state;
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]); // State for completed todos
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (user?._id) {
      setUserId(user._id);
    }
  }, [user]);

  useEffect(() => {
    if (userId) {
      fetchTodos();
      fetchCompletedTodos(); // Fetch completed todos
    }
  }, [userId]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`/api/todo/${userId}`);
      setTodos(response.data.filter(todo => !todo.isCompleted));
    } catch (error) {
      console.error("Error fetching todos", error);
    }
  };

  const fetchCompletedTodos = async () => {
    try {
      const response = await axios.get(`/api/todo/completed/${userId}`);
      setCompletedTodos(response.data);
    } catch (error) {
      console.error("Error fetching completed todos", error);
    }
  };

  const addTodo = async () => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    try {
      const response = await axios.post("/api/todo/createtodo", {
        title,
        dueDate,
        isCompleted: false,
        userId
      });
      setTodos([...todos, response.data]);
      setTitle("");
      setDueDate("");
    } catch (error) {
      console.error("Error adding todo", error);
    }
  };

  const editTodo = (todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDueDate(todo.dueDate);
    setIsModalOpen(true);
  };

  const updateTodo = async (id) => {
    // Date validation to prevent past dates
    const selectedDate = new Date(dueDate);
    const currentDate = new Date();
    if (selectedDate < currentDate) {
      alert("Please select a future date.");
      return;
    }

    try {
      const response = await fetch(`/api/todo/updatetodo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          title,
          dueDate,
          isCompleted: editingTodo.isCompleted
        }),
      });

      const updatedTodo = await response.json();
      setTodos(todos.map(todo => (todo._id === editingTodo._id ? updatedTodo : todo)));
      setIsModalOpen(false);
      setTitle("");
      setDueDate("");
    } catch (error) {
      console.error("Error updating todo", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`/api/todo/deletetodo`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setTodos(todos.filter(todo => todo._id !== id));
      }
    } catch (error) {
      console.error("Error deleting todo", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-6">To-Do List</h1>

        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            placeholder="Enter a new task"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="ml-4 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
          />
          <button
            onClick={addTodo}
            className="ml-4 px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none transition duration-200"
          >
            Create Todo
          </button>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900">Pending Todos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">No tasks yet. Add a task!</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6"
              >
                <div className="text-xl font-semibold text-gray-800">{todo.title}</div>
                <div className="text-gray-600">Due: {new Date(todo.dueDate).toLocaleDateString()}</div>
                <div className="mt-4">
                  <button
                    onClick={() => editTodo(todo)}
                    className="px-4 py-2 text-white bg-yellow-500 rounded-md mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="px-4 py-2 text-white bg-red-500 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <h2 className="text-2xl font-semibold text-gray-900">Completed Todos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedTodos.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">No completed tasks yet.</p>
          ) : (
            completedTodos.map((todo) => (
              <div
                key={todo._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6"
              >
                <div className="text-xl font-semibold text-gray-800">{todo.title}</div>
                <div className="text-gray-600">Date: {new Date(todo.dueDate).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Edit Todo</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 mb-4 rounded-lg border border-gray-300"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-4 mb-4 rounded-lg border border-gray-300"
            />
            <select
              value={editingTodo.isCompleted ? "Completed" : "Pending"}
              onChange={(e) =>
                setEditingTodo({ ...editingTodo, isCompleted: e.target.value === "Completed" })
              }
              className="w-full p-4 mb-4 rounded-lg border border-gray-300"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="flex justify-between">
              <button
                onClick={() => updateTodo(editingTodo._id)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Update
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoPage;
