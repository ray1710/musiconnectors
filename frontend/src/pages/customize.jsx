import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const genres = [
  "Pop",
  "Hip-Hop",
  "Rock",
  "EDM",
  "Indie",
  "Jazz",
  "Classical",
  "R&B",
  "Reggae",
  "Folk",
  "Metal",
  "Blues",
  "Country",
  "Latin",
];

export default function GenreSelector() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [favSong, setFavSong] = useState("");
  const [favArtist, setFavArtist] = useState("");
  const [favLyric, setFavLyric] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("Token");
    console.log(token);
    if (!token) {
      navigate("/");
    }
  }, []);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  async function handleContinue() {
    console.log("Genres:", selectedGenres);
    console.log("Favorite Song:", favSong);
    console.log("Favorite Lyric:", favLyric);
    console.log("Favorite Artist:", favArtist);
    if (
      selectedGenres == "" ||
      favSong == "" ||
      favLyric == "" ||
      favArtist == ""
    ) {
      alert("Please fill out the page");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/addCustomizedInfo",
        {
          genres: selectedGenres,
          song: favSong,
          lyric: favLyric,
          artist: favArtist,
        },
        {
          headers: {
            Authorization: localStorage.getItem("Token"),
          },
        }
      );
    } catch (error) {
      throw error;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-800 to-black flex flex-col items-center py-10 px-4">
      <h1 className="text-white text-3xl font-bold mb-6">Select Your Genres</h1>

      <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            className={`px-4 py-2 rounded-full border-2 transition-all duration-200
              ${
                selectedGenres.includes(genre)
                  ? "bg-purple-600 border-purple-300 text-white shadow-lg"
                  : "bg-black border-purple-800 text-purple-300 hover:bg-purple-700 hover:text-white"
              }
            `}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="mt-10 w-full max-w-xl space-y-6">
        <div>
          <label className="block text-white mb-2 text-lg font-semibold">
            Favorite Song
          </label>
          <input
            type="text"
            value={favSong}
            onChange={(e) => setFavSong(e.target.value)}
            placeholder="e.g. Blinding Lights"
            className="w-full px-4 py-2 rounded-md bg-black text-white border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-white mb-2 text-lg font-semibold">
            Favorite Artist
          </label>
          <input
            type="text"
            value={favArtist}
            onChange={(e) => setFavArtist(e.target.value)}
            placeholder="e.g. Weeknd"
            className="w-full px-4 py-2 rounded-md bg-black text-white border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-white mb-2 text-lg font-semibold">
            Favorite Lyric
          </label>
          <textarea
            value={favLyric}
            onChange={(e) => setFavLyric(e.target.value)}
            placeholder="e.g. I’m blinded by the lights..."
            className="w-full px-4 py-2 rounded-md bg-black text-white border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
          ></textarea>
        </div>

        <button
          onClick={handleContinue}
          className="mt-4 w-full py-3 rounded-md bg-purple-700 hover:bg-purple-800 text-white font-bold text-lg transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
