// Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";

const Navbar = ({ search, setSearch }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
      {/* Brand */}
      <Link
        to="/"
        className="text-xl font-bold text-gray-400 hover:text-indigo-300"
        onClick={() => setSearch("")}
      >
        NotesApp
      </Link>

      {/* Search */}
      <div className="flex-1 max-w-md mx-4">
        <input
          type="text"
          placeholder="Search notes by title or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-4 pr-4 py-3 bg-gray-700 rounded-full shadow-sm 
                     text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:bg-gray-800"
        />
      </div>

      {/* User Buttons */}
      <div className="flex items-center gap-4">
        {user ? (
          <button
            onClick={logout}
            className="!bg-gray-600 text-white px-4 py-2 rounded hover:!bg-white hover:!text-black font-semibold transition-colors duration-200"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="text-white px-4 py-2 rounded hover:text-indigo-300 font-semibold"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
