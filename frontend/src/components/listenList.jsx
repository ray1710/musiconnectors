import React from "react";
import { useNavigate } from "react-router-dom";

function ListenList() {
  const navigate = useNavigate();

  return (
    <div className="px-8 py-6">
      {/* Section Header */}
      <h2 className="text-white text-2xl font-bold mb-6">Listen List</h2>

      {/* Login Prompt Card */}
      <div className="bg-transparent rounded-lg p-8 text-center border border-gray-700">
        <div className="mb-4">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>

        <h3 className="text-white text-xl font-semibold mb-2">
          Create Your Personal List
        </h3>
        <p className="text-gray-300 mb-6">
          Log in to save your favorite albums and create custom playlists
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-purple-600 hover:bg-purple-800 text-white font py-3 px-6 rounded-lg transition duration-200"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="w-full border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListenList;
