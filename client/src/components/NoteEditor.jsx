import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const NoteEditor = ({ selectedNote, onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
      setTags(selectedNote.tags.join(","));
    } else {
      setTitle("");
      setContent("");
      setTags("");
    }
  }, [selectedNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    const isUpdate = !!selectedNote;

    const noteData = {
      title,
      content,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      let res;

      if (isUpdate) {
        // Update note with toast
        res = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/notes/${selectedNote._id}`,
          noteData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create note
        res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/notes`,
          noteData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Show create toast
        toast.success("Note created successfully!", {
          duration: 2000,
        });

        // Wait a bit before navigating to allow toast to be visible
        setTimeout(() => {
          navigate("/notes");
        }, 1500); // Navigate after 1.5 seconds
      }

      // Call onSave callback if provided
      if (onSave) {
        try {
          onSave(res.data);
        } catch (err) {
          console.error("onSave error:", err);
        }
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to save note");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 max-w-2xl mx-auto space-y-4"
      >
        <input
          type="text"
          placeholder="Enter note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSubmitting}
          className="w-full px-4 py-3 text-lg font-semibold border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-gray-800 focus:outline-none placeholder-gray-400
                     disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <textarea
          placeholder="Write your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="6"
          disabled={isSubmitting}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-gray-800 focus:outline-none placeholder-gray-400
                     disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          disabled={isSubmitting}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-gray-800 focus:outline-none placeholder-gray-400
                     disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gray-900 text-white font-medium py-3 rounded-lg 
                     hover:bg-gray-800 transition duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Saving..."
            : selectedNote
            ? "Update Note"
            : "Create Note"}
        </button>
      </form>
    </>
  );
};

export default NoteEditor;
