import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Header from "../components/header";
import axios from "axios";
import ColorThief from "colorthief";
import { Fragment } from "react";

export default function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [bgColor, setBgColor] = useState("rgba(0, 0, 0, 1)");
  const [textColor, setTextColor] = useState("white");
  const [showAllTracks, setShowAllTracks] = useState(false);
  const imgRef = useRef(null);

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
        const darkenedR = Math.floor(r * 0.3);
        const darkenedG = Math.floor(g * 0.3);
        const darkenedB = Math.floor(b * 0.3);
        setBgColor(`rgba(${darkenedR}, ${darkenedG}, ${darkenedB}, 1)`);
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
    <Fragment>
      <Header />
      <div className="bg-gray-950 pt-8">
        <div
          className="mx-8 rounded-lg"
          style={{
            backgroundColor: bgColor,
            color: textColor,
          }}
        >
          <div className="p-8 text-white">
            <h1 className="text-3xl font-bold mb-4">{album.name}</h1>

            <div className="flex gap-8">
              <img
                ref={imgRef}
                src={album.image}
                alt={album.name}
                crossOrigin="anonymous"
                className="w-64 h-64 object-cover rounded"
              />
              <div className="flex flex-col justify-center h-64">
                <p>Artist: {album.artist}</p>
                <p>{album.num_of_tracks} Tracks</p>
                <p>Release Date: {album.release_date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-screen flex py-15 px-8 bg-gray-950">
        <div className="flex gap-6 w-full h-3/4">
          {/* Tracks Section */}
          <div
            className="w-2/3 rounded-lg shadow-2xl"
            style={{
              backgroundColor: bgColor,
            }}
          >
            <div className="p-8 text-white h-full flex flex-col">
              <h2 className="text-2xl font-bold mb-4">Tracks</h2>
              <div className="space-y-2 overflow-y-auto flex-1">
                {album.tracks &&
                  album.tracks.map((track, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-gray-950 hover:bg-opacity-10 rounded"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400 w-6">
                          {track.track_num}
                        </span>
                        <div>
                          <div className="text-white">{track.track_name}</div>
                          <div className="text-gray-400 text-sm">
                            {track.artist}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div
            className="w-1/3 rounded-lg shadow-2xl"
            style={{
              backgroundColor: bgColor,
            }}
          >
            <button className=" hover:bg-gray-950 text-white px-2 py-3 w-full rounded transition border-b border-white">
              Leave Review
            </button>
            <button className=" hover:bg-gray-950 text-white px-2 py-3 w-full rounded transition border-b border-white">
              Leave Comment
            </button>
            <button className="hover:bg-gray-950 text-white px-2 py-3 w-full rounded transition border-b border-white">
              Add to List
            </button>
            <button className="hover:bg-gray-950 text-white px-2 py-3 w-full rounded transition border-b border-white">
              Listen on Spotify
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
