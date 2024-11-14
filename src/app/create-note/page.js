// pages/index.js
"use client";
import React, { useState } from "react";
import TipTapEditor from "@/app/component/QuillEditor";
import { FaSave } from "react-icons/fa";
import { useGlobalContext } from "../redux/store";

const CreateNote = () => {
  const { state } = useGlobalContext(); // Access context for user data
  const { user, isAuthenticated } = state;

  const [editorContent, setEditorContent] = useState("");
  const [category, setCategory] = useState(""); // State for category

  const handleSaveNote = async () => {
    const noteData = {
      userId: user?._id, // Include user ID
      title: "My Styled Note",
      content: editorContent,
      category, // Include category
    };
   console.log(noteData)
    const response = await fetch("/api/notes/savenote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noteData),
    });
  console.log("response:",response.status)
    const result = await response.json();
    if (response.ok) {
      alert("Note saved successfully!");
    } else {
      alert("Failed to save the note.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-10 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-2xl rounded-lg mt-12">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
        Create Your Styled Note
      </h2>

      {/* Category input */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-lg font-medium text-gray-600">
          Select Category
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter note category"
        />
      </div>

      {/* TipTapEditor Component */}
      <TipTapEditor content={editorContent} setContent={setEditorContent} />

      <div className="text-center mt-8">
        <button
          onClick={handleSaveNote}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition duration-300 shadow-lg"
        >
          <FaSave className="mr-2" />
          Save Note
        </button>
      </div>
    </div>
  );
};

export default CreateNote;
