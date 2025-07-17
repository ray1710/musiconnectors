import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Album from "../components/album";

export default function MainPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [albums, setAlbums] = useState([]);

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
        setAlbums(res.data.result[0]);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    }

    getProfile();
    getAlbums();
  }, []);

  return (
    <Fragment>
      <h1 className="mt-6 text-center text-3xl font-extrabold dark:text-white p-8">
        Placeholder
      </h1>
      {user && albums ? (
        <div className="p-8 dark:text-white">
          <h1 className="text-2xl mb-4 text-center">
            Welcome, {user.username}
          </h1>
          {albums.map((album, index) => (
            <Album name={album["name"]} img={album["image"]} />
          ))}
        </div>
      ) : (
        <p>Loading user profile...</p>
      )}
    </Fragment>
  );
}
