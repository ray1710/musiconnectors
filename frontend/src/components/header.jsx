import React from "react";
import { useNavigate } from "react-router-dom";
import { useAlbumContext } from "../context/albumContext";

function Header({ user, setUser }) {
  const navigate = useNavigate();
  const { setAlbums } = useAlbumContext();

  const handleLogout = () => {
    localStorage.removeItem("Token");
    setUser(null);
    setAlbums(null);
    navigate("/");
  };

  return (
    <header className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/main")}
      >
        PlaceHolder
      </h1>

      <div className="flex items-center gap-4">
        {user && (
          <p className="text-sm text-gray-300">Welcome, {user.username}</p>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
