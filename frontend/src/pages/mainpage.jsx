import React, { Fragment, useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Album from "../components/album";

export default function MainPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [albums, setAlbums] = useState([]);
  const scrollRef = useRef(null);

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
        setAlbums(res.data.result);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    }

    getProfile();
    getAlbums();
  }, []);

  // Scroll handlers
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

      {user && albums.length > 0 ? (
        <div className="p-8 dark:text-white">
          <h1 className="text-2xl mb-4 text-center">
            Welcome, {user.username}
          </h1>

          <div className="relative">
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-black transition"
            >
              ◀
            </button>

            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-black transition"
            >
              ▶
            </button>

            <div
              ref={scrollRef}
              className="overflow-x-auto scrollbar-hidden px-10 scroll-smooth"
            >
              <div className="flex gap-6 w-fit py-4">
                {albums.map((album, index) => (
                  <div key={index} className="shrink-0 w-[320px]">
                    <Album album={album} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-white p-8">Loading user profile...</p>
      )}
    </Fragment>
  );
}
