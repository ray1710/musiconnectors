import React, { useEffect, useRef, useState } from "react";
import ColorThief from "colorthief";
import { useNavigate } from "react-router-dom";

function Album({ album }) {
  const navigate = useNavigate();
  const imgRef = useRef(null);
  const [dominantColor, setDominantColor] = useState("rgba(0,0,0,0)");

  useEffect(() => {
    const image = imgRef.current;

    if (album.image && image.complete) {
      extractColor();
    } else {
      image.onload = extractColor;
    }

    function extractColor() {
      try {
        const colorThief = new ColorThief();
        const result = colorThief.getColor(image);
        const [r, g, b] = result;
        setDominantColor(`rgba(${r}, ${g}, ${b}, 0.8)`);
      } catch (err) {
        console.error("Error getting color:", err);
      }
    }
    console.log(album);
  }, [album.img]);

  function goTo() {
    navigate(`/album/${album.id}`);
  }

  return (
    <div
      className="w-[800px] h-[315px] rounded-lg transition duration-300 p-4 shadow-md border border-white/10 text-white flex items-center justify-between gap-6"
      style={{
        backgroundColor: "transparent",
        transition: "background-color 0.3s ease-in-out",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = dominantColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <img
        ref={imgRef}
        src={album.image}
        alt={album.name}
        crossOrigin="anonymous"
        className="w-70 h-70 object-cover rounded"
      />

      <div className="flex flex-col justify-center items-start flex-1">
        <h2 className="text-2xl font-semibold mb-2">{album.name}</h2>
        <p className="text-sm opacity-80 mb-4">Artist: {album.artist}</p>
        <button
          className="mt-auto bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
          onClick={goTo}
        >
          View Album
        </button>
      </div>
    </div>
  );
}

export default Album;
