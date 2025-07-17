import React, { useEffect, useRef, useState } from "react";
import ColorThief from "colorthief";

function Album({ name, img }) {
  const imgRef = useRef(null);
  const [dominantColor, setDominantColor] = useState("rgba(0,0,0,0)");

  useEffect(() => {
    const image = imgRef.current;

    if (image && image.complete) {
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
  }, [img]);

  return (
    <div
      className="w-[800px] h-[300px] rounded-lg transition duration-300 p-4 shadow-md border border-white/10 text-white flex flex-col"
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
        src={img}
        alt={name}
        crossOrigin="anonymous"
        className="w-48 h-48 object-cover rounded mb-4 self-start"
      />
      <h2 className="text-lg font-semibold text-left">{name}</h2>
    </div>
  );
}

export default Album;
