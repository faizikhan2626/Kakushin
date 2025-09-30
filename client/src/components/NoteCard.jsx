import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const NoteCard = ({ note, onDelete, onTagClick }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate(); // <-- for navigation

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/notes/${note._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(note._id);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleOpenEditor = () => {
    navigate(`/notes/${note._id}`); // navigate to editor page
  };

  return (
    <div className="relative bg-gray-100 rounded-xl shadow hover:shadow-lg transition p-6 group">
      {/* Delete icon */}
      <div className="absolute top-2 right-2 z-20">
        <div
          className="cursor-pointer transform transition-transform duration-300 group-hover:-translate-y-1"
          onClick={(e) => {
            e.stopPropagation(); // prevent triggering card click
            setShowConfirm(true);
          }}
        >
          <span className="inline-block text-2xl">🗑️</span>
        </div>

        {/* Confirmation card */}
        {showConfirm && (
          <div className="absolute right-0 mt-2 w-48 p-4 bg-white border rounded-lg shadow-lg z-30 animate-fadeIn">
            <p className="text-sm text-gray-800 mb-2">Delete this note?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-2 py-1 text-sm !text-white !bg-black !border-none"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-2 py-1 text-sm !text-white !bg-red-600 rounded !border-none "
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Clickable note content */}
      <div className="cursor-pointer" onClick={handleOpenEditor}>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {note.title || "Untitled"}
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
          {note.content || "No content available"}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {note.tags?.length > 0 ? (
            note.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-medium bg-gray-300 text-gray-800 rounded-full cursor-pointer hover:bg-gray-400"
                onClick={(e) => {
                  e.stopPropagation(); // prevent card click
                  onTagClick(tag); // set search
                }}
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500">No tags</span>
          )}
        </div>

        <p className="text-xs text-gray-500">
          {new Date(note.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default NoteCard;
