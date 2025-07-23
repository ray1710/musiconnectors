import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    async function fetchAlbum() {
      try {
        const res = await axios.get(`http://localhost:3000/album/${id}`);
        console.log(res.data);
        setAlbum(res.data);
      } catch (err) {
        console.error("Failed to fetch album", err);
      }
    }

    fetchAlbum();
  }, [id]);

  if (!album) return <p className="text-white p-4">Loading album...</p>;

  return (
    <div className="text-white p-8">
      <h1 className="text-3xl font-bold mb-4">{album.name}</h1>

      <div className="flex gap-8">
        <img
          src={album.image || "/placeholder.jpg"}
          alt={album.name}
          className="w-64 h-64 object-cover"
        />

        <div className="flex-1 max-h-64 overflow-y-auto scrollbar-hidden border border-gray-600 rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Tracks</h2>
          <ul className="space-y-2">
            {album.tracks && album.tracks.length > 0 ? (
              album.tracks.map((track, idx) => (
                <li key={idx} className="hover:text-blue-400">
                  <p className="font-medium">
                    {track.track_name} - {track.artist}
                  </p>
                </li>
              ))
            ) : (
              <p>No tracks available.</p>
            )}
          </ul>
        </div>
      </div>

      <p className="mt-6">Artist: {album.artist}</p>
    </div>
  );
}
