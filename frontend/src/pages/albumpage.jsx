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
      <h1 className="text-3xl font-bold">{album.name}</h1>
      <img src={album.image} alt={album.name} className="w-64 mt-4" />
      <p className="mt-2">Artist: {album.artist}</p>
    </div>
  );
}
