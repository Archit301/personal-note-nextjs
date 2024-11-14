"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TipTapEditor from "@/app/component/QuillEditor"; // Import the TipTapEditor

const ViewNote = () => {
  const router = useRouter();
  const { id } = useParams(); // Retrieves noteId from the dynamic route
  const [note, setNote] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false); // State for edit modal
  const [editContent, setEditContent] = useState(""); // State for editor content
  const [editTitle, setEditTitle] = useState(""); // State for title
  const [editCategory, setEditCategory] = useState(""); // State for category

  const noteId = id;

  // Fetch the note details to display
  useEffect(() => {
    if (noteId) {
      const fetchNote = async () => {
        try {
          const response = await fetch(`/api/notes/getnotes/${noteId}`);
          if (response.ok) {
            const data = await response.json();
            setNote({
              id: data._id,
              title: data.title,  // Assuming 'title' is saved in the DB
              content: data.content,  // This is stored as HTML
              category: data.category,
              date: new Date(data.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            });
            setEditTitle(data.title);
            setEditContent(data.content);  // Set HTML content for editing
            setEditCategory(data.category);
          } else {
            console.error("Failed to fetch note:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching note:", error);
        }
      };
      fetchNote();
    }
  }, [noteId]);

  // Function to handle note update
  const handleUpdateNote = async () => {
    try {
      const response = await fetch(`/api/notes/updatenote`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          noteId,
          content: editContent,  // Pass the HTML content to update
          category: editCategory,
        }),
      });
      if (response.ok) {
        const updatedNote = await response.json();
        setNote({
          ...note,
          content: updatedNote.content,  // Update content with new HTML
          category: updatedNote.category,
        });
        setEditModalOpen(false); // Close modal on success
      } else {
        console.error("Failed to update note:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  if (!note) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading note details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-50 to-indigo-100 p-8">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200">
        
        {/* Header and Actions */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">{note.title}</h2>
          <div className="flex space-x-3">
            <button
              onClick={() => setEditModalOpen(true)} // Open modal on edit click
              className="px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-100 transition"
            >
              Edit
            </button>
            <button
              onClick={() => router.push("/notes")}
              className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-full hover:bg-gray-100 transition"
            >
              Back to Notes
            </button>
          </div>
        </div>

        {/* Note Details */}
        <div className="mt-4 space-y-4">
          <div className="text-gray-500 text-sm">
            {note.category} &middot; {note.date}
          </div>
          <div className="prose max-w-none text-gray-700">
            {/* Render HTML content safely */}
            <div dangerouslySetInnerHTML={{ __html: note.content }} />
          </div>
        </div>
      </div>

      {/* Edit Note Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Edit Note</h3>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
              placeholder="Note Title"
            />
            <input
              type="text"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
              placeholder="Category"
            />

            {/* Include TipTapEditor for content editing */}
            <TipTapEditor content={editContent} setContent={setEditContent} />

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-full hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateNote}
                className="px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-100 transition"
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewNote;
