import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "../styles.css";
import NoteCard from "../components/NoteCard";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");
      let filtered = res.data;

      if (search.trim()) {
        const regex = new RegExp(search.trim(), "i");
        filtered = res.data.filter(
          (note) =>
            regex.test(note.title) || note.tags.some((tag) => regex.test(tag))
        );
      }

      setNotes(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search]);

  // New: handler for tag clicks
  const handleTagClick = (tag) => {
    setSearch(tag); // sets search input to clicked tag
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Notes</h2>
        <Link to="/notes/new">
          <button className="px-5 py-2 bg-black !border-none text-white rounded-full shadow hover:bg-gray-800 transition">
            + New Note
          </button>
        </Link>
      </div>

      {/* Notes Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            onDelete={(deletedId) =>
              setNotes(notes.filter((n) => n._id !== deletedId))
            }
            onTagClick={handleTagClick} // <-- pass the callback
          />
        ))}
      </div>

      {/* Empty State */}
      {notes.length === 0 && (
        <p className="text-gray-500 text-center mt-10">No notes found.</p>
      )}
    </div>
  );
};

export default Notes;
