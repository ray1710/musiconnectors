import React, { Fragment, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Browse from "../components/browse";
import { useAlbumContext } from "../context/albumContext";

export default function MainPage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [user, setUser] = useState(null);
  const { albums, setAlbums } = useAlbumContext();

  useEffect(() => {
    async function getProfile() {
      try {
        const token = localStorage.getItem("Token");
        const res = await axios.get("http://localhost:3000/currentuser", {
          headers: {
            Authorization: token,
          },
        });
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/");
      }
    }

    async function getAlbums() {
      if (!albums) {
        try {
          const token = localStorage.getItem("Token");
          const res = await axios.get(
            "http://localhost:3000/reccommendedAlbums",
            {
              headers: {
                Authorization: token,
              },
            }
          );
          console.log(res.data.result);
          setAlbums(res.data.result); // Save to context
        } catch (error) {
          console.error("Error fetching albums:", error);
        }
      }
    }

    getProfile();
    getAlbums();
  }, [navigate, albums, setAlbums]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <Fragment>
      <h1 className="mt-6 text-center text-3xl font-extrabold dark:text-white p-8">
        Placeholder
      </h1>

      {user && albums ? (
        <div>
          {Object.keys(albums).map((key) => (
            <Browse key={key} genre={key} list={albums[key]} />
          ))}
        </div>
      ) : (
        <p className="text-white p-8">Loading user profile...</p>
      )}
    </Fragment>
  );
}
