"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../redux/store";

const Notes = () => {
  const router = useRouter();
  const [notes, setNotes] = useState([]); // Notes state
  const { state } = useGlobalContext();
  const { user } = state;

  useEffect(() => {
    if (!user?._id) return; // Don't run fetch if user or userId is not available

    const fetchNotes = async () => {
      try {
        const userId = user._id; // Access userId after ensuring user is loaded
        console.log("User ID:", userId); // Check if the userId is available
        const response = await fetch(`/api/notes/${userId}`);
        if (response.ok) {
          const data = await response.json();
          const formattedNotes = data.map((note) => ({
            id: note._id,
            title: note.content.substring(0, 20) + "...",
            content: decodeHtml(note.content),
            category: note.category,
            date: new Date(note.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          }));
          setNotes(formattedNotes);
        } else {
          console.error("Failed to fetch notes:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, [user]);

  // Function to decode HTML content
  const decodeHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Handle note deletion with immediate UI update
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/notes/deletenote`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noteId: id }),
      });

      if (response.ok) {
        // Remove the deleted note from the state immediately
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      } else {
        console.error("Failed to delete note:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Handle note viewing (if needed)
  const handleView = (id) => {
    router.push(`/view-note/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-extrabold text-gray-900">Notes</h2>
          <button
            className="px-6 py-3 text-white font-semibold bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all"
            onClick={() => router.push("/create-note")}
          >
            + Create Note
          </button>
        </div>

        {/* Notes Grid with larger cards */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="relative p-8 bg-white shadow-lg rounded-xl border-l-4 border-indigo-500 hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1"
            >
              <h3 className="text-2xl font-semibold text-gray-800">{note.title}</h3>
              <p className="mt-3 text-gray-500 text-sm">
                {note.category} &middot; {note.date}
              </p>
              <p className="mt-4 text-gray-700 line-clamp-4">
                {note.content.length > 120 ? `${note.content.slice(0, 120)}...` : note.content}
              </p>

              <div className="absolute top-4 right-4 flex space-x-3">
                <button
                  onClick={() => handleView(note.id)}
                  className="text-indigo-500 hover:text-indigo-700 transform hover:scale-110"
                  title="View Note"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.274 1.243-1.573 3-2.542 3H4.458c-.97 0-2.268-1.757-2.542-3z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-red-500 hover:text-red-700 transform hover:scale-110"
                  title="Delete Note"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.136 21H7.864a2 2 0 01-1.997-1.858L5 7m5 4v6m4-6v6M1 7h22" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {notes.length === 0 && (
            <p className="text-gray-500 text-center col-span-full">No notes available. Start by creating your first note!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
