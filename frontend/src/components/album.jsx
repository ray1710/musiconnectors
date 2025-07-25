import React, { useEffect, useRef, useState } from "react";
import ColorThief from "colorthief";
import { useNavigate } from "react-router-dom";

function Album({ album }) {
  const navigate = useNavigate();
  const imgRef = useRef(null);
  const [dominantColor, setDominantColor] = useState("rgba(0,0,0,0.5)");
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const image = imgRef.current;

    function extractColor() {
      try {
        const colorThief = new ColorThief();
        const [r, g, b] = colorThief.getColor(image);
        setDominantColor(`rgba(${r}, ${g}, ${b}, 0.85)`);
      } catch (err) {
        console.error("ColorThief failed:", err);
      }
    }

    if (image && image.complete) {
      extractColor();
    } else {
      image.onload = extractColor;
    }
  }, [album.image]);

  function goTo() {
    navigate(`/album/${album.id}`);
  }

  return (
    <div
      onClick={goTo}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-60 shrink-0 rounded-lg overflow-hidden cursor-pointer transition duration-300 border border-white/10 hover:scale-105"
      style={{
        backgroundColor: hovered ? dominantColor : "rgba(255,255,255,0.05)",
      }}
    >
      <img
        ref={imgRef}
        src={album.image}
        alt={album.name}
        crossOrigin="anonymous"
        className="w-full h-60 object-cover"
      />
      <div className="p-3 text-white">
        <p className="text-base font-semibold truncate">{album.name}</p>
        <p className="text-sm text-gray-300 truncate">{album.artist}</p>
      </div>
    </div>
  );
}

export default Album;
