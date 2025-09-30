// client/src/App.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import API from "./api/axios";
import { getUserFromToken, removeToken } from "./utils/auth";
import NoteEditorWithFetch from "./components/NoteEditorWithFetch.jsx";

import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Notes from "./pages/Notes.jsx";
import NoteEditor from "./components/NoteEditor.jsx";

/** ---------------- AUTH CONTEXT ---------------- */
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = getUserFromToken();
      if (!decoded || (decoded.exp && decoded.exp * 1000 < Date.now())) {
        removeToken();
        setUser(null);
        setLoading(false);
        return;
      }
    } catch {}

    try {
      const res = await API.get("/auth/me");
      setUser(res.data);
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** ---------------- PRIVATE ROUTE ---------------- */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading)
    return <div style={{ padding: 24, textAlign: "center" }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

/** ---------------- APP ---------------- */
export default function App() {
  const [search, setSearch] = useState(""); // lift search state here

  return (
    <AuthProvider>
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Navbar search={search} setSearch={setSearch} />
        <main style={{ flex: 1 }} className="container mx-auto px-6 py-10">
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected */}
            <Route
              path="/notes"
              element={
                <PrivateRoute>
                  <Notes search={search} />
                </PrivateRoute>
              }
            />
            <Route
              path="/notes/new"
              element={
                <PrivateRoute>
                  <NoteEditor />
                </PrivateRoute>
              }
            />
            <Route
              path="/notes/:id"
              element={
                <PrivateRoute>
                  <NoteEditorWithFetch />
                </PrivateRoute>
              }
            />

            {/* Root & fallback */}
            <Route path="/" element={<Navigate to="/notes" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
