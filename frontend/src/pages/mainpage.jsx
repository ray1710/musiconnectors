import React, { Fragment, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Browse from "../components/browse";
import Header from "../components/header";
import { useAlbumContext } from "../context/albumContext";
import { useUserContext } from "../context/userContext";

export default function MainPage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const { user, setUser } = useUserContext();
  const { albums, setAlbums } = useAlbumContext();

  useEffect(() => {
    async function getProfile() {
      if (!user) {
        try {
          const token = localStorage.getItem("Token");
          const res = await axios.get("http://localhost:3000/currentuser", {
            headers: { Authorization: token },
          });
          setUser(res.data.user);
        } catch (err) {
          console.error("Error fetching profile", err);
          navigate("/");
        }
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
          setAlbums(res.data.result);
        } catch (error) {
          console.error("Error fetching albums:", error);
        }
      }
    }

    getProfile();
    getAlbums();
  }, [navigate, albums, setAlbums, user, setUser]);

  return (
    <Fragment>
      {user && albums ? (
        <div>
          <Header user={user} setUser={setUser} />
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
