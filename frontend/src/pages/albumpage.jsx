import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ColorThief from "colorthief";

export default function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [bgColor, setBgColor] = useState("rgba(0, 0, 0, 1)");
  const [textColor, setTextColor] = useState("white");
  const imgRef = useRef(null);

  // Helper to choose black or white text based on background brightness
  function getTextColorForBackground(r, g, b) {
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 150 ? "black" : "white";
  }

  useEffect(() => {
    async function fetchAlbum() {
      try {
        const res = await axios.get(`http://localhost:3000/album/${id}`);
        setAlbum(res.data);
      } catch (err) {
        console.error("Failed to fetch album", err);
      }
    }

    fetchAlbum();
  }, [id]);

  useEffect(() => {
    if (!album || !imgRef.current) return;

    const image = imgRef.current;

    function extractColor() {
      try {
        const colorThief = new ColorThief();
        const [r, g, b] = colorThief.getColor(image);
        setBgColor(`rgba(${r}, ${g}, ${b}, 0.85)`);
        setTextColor(getTextColorForBackground(r, g, b));
      } catch (err) {
        console.error("Color extraction failed", err);
      }
    }

    if (image.complete) {
      extractColor();
    } else {
      image.onload = extractColor;
    }
  }, [album]);

  if (!album) return <p className="text-white p-4">Loading album...</p>;

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">{album.name}</h1>

        <div className="flex gap-8">
          <img
            ref={imgRef}
            src={album.image}
            alt={album.name}
            crossOrigin="anonymous"
            className="w-64 h-64 object-cover rounded"
          />

          <div
            className="flex-1 max-h-64 overflow-y-auto rounded p-4 scrollbar-hidden"
            style={{ border: `1px solid ${textColor}` }}
          >
            <h1 className="text-xl font-semibold mb-2">Tracks</h1>
            <ul className="divide-y" style={{ borderColor: textColor }}>
              {album.tracks && album.tracks.length > 0 ? (
                album.tracks.map((track, idx) => (
                  <li key={idx} className="py-2">
                    {track.track_name} — {track.artist}
                  </li>
                ))
              ) : (
                <p>No tracks available.</p>
              )}
            </ul>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="mt-6 w-64 space-y-2">
            <p>Artist: {album.artist}</p>
            <p>Number Of Tracks: {album.num_of_tracks}</p>
            <p>Release Date: {album.release_date}</p>
          </div>

          <div
            className="flex-1 mt-6 rounded h-64 p-4"
            style={{ border: `1px solid ${textColor}` }}
          >
            <h1 className="text-center text-lg font-semibold">
              Comments --- Reviews
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
