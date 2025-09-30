// client/src/components/NoteEditorWithFetch.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import NoteEditor from "./NoteEditor";

const NoteEditorWithFetch = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true); // wait for fetch
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await API.get(`/notes/${id}`);
        setNote(res.data);
      } catch (err) {
        console.error(err);
        // Redirect if note not found
        navigate("/notes", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  if (loading) {
    return <div className="text-center p-10">Loading note...</div>;
  }

  return (
    <NoteEditor
      selectedNote={note}
      onSave={() => navigate("/notes", { replace: true })}
    />
  );
};

export default NoteEditorWithFetch;
