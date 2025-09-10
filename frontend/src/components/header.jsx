import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAlbumContext } from "../context/albumContext";
import { useUserContext } from "../context/userContext";

function Header({ user, setUser }) {
  const navigate = useNavigate();
  const { setAlbums } = useAlbumContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("Token");
    setUser(null);
    setAlbums(null);
    navigate("/");
  };

  const handleProfile = () => {
    navigate(`/profile/${user.username}`);
  };

  const handleMain = () => {
    navigate(`/`);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page or handle search logic
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      setShowResults(true);
      // TODO: Implement actual search logic here
      // For now, setting empty results as requested
      setSearchResults([]);

      // Example of how you might implement search:
      // performSearch(query).then(results => setSearchResults(results));
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  const handleResultClick = (result) => {
    // Handle clicking on a search result
    setShowResults(false);
    setSearchQuery("");
    // Navigate to the selected result
    // navigate(`/album/${result.id}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        PlaceHolder
      </h1>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8 relative" ref={searchRef}>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search albums, artists..."
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>

        {/* Search Results Dropdown */}
        {showResults && (
          <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-lg mt-1 shadow-lg z-50 max-h-96 overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <div
                  key={index}
                  onClick={() => handleResultClick(result)}
                  className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    {result.image && (
                      <img
                        src={result.image}
                        alt={result.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div>
                      <div className="text-white font-medium">
                        {result.name}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {result.artist}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-400 text-center">
                No results found
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <p className="text-sm text-gray-300">Welcome, {user.username}</p>
            <button
              onClick={handleMain}
              className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-1.5 rounded transition"
            >
              Main Page
            </button>
            <button
              onClick={handleProfile}
              className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-1.5 rounded transition"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleLogin}
              className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-1.5 rounded transition"
            >
              Login
            </button>
            <button
              onClick={handleSignup}
              className="bg-green-600 hover:bg-green-800 text-white px-4 py-1.5 rounded transition"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
