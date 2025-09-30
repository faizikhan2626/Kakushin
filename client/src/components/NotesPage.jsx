import React, { useEffect, useState } from "react";
import axios from "axios";
import NoteEditor from "./NoteEditor";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);

  const fetchNotes = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notes`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { search },
    });
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, [search]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <NoteEditor
        selectedNote={selectedNote}
        onSave={(note) => {
          fetchNotes();
          setSelectedNote(null);
        }}
      />
      <ul className="note-list">
        {notes.map((note) => (
          <li key={note._id} onClick={() => setSelectedNote(note)}>
            <h3>{note.title}</h3>
            <p>{note.content.slice(0, 50)}...</p>
            <small>{note.tags.join(", ")}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesPage;
