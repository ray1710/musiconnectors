import React, { Fragment, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Browse from "../components/browse";
import Header from "../components/header";
import ListenList from "../components/listenList";
import { useAlbumContext } from "../context/albumContext";
import { useUserContext } from "../context/userContext";

export default function MainPage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const { user, setUser } = useUserContext();
  const { albums, setAlbums } = useAlbumContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("Token");

        const promises = [];
        let userPromiseIndex = -1;
        let albumsPromiseIndex = -1;

        // Only fetch user if token exists and user not already loaded
        if (token && !user) {
          userPromiseIndex = promises.length;
          promises.push(
            axios.get("http://localhost:3000/currentuser", {
              headers: { Authorization: token },
            })
          );
        }

        // Always fetch albums if not already loaded
        if (!albums) {
          albumsPromiseIndex = promises.length;
          const albumsRequest = token
            ? axios.get("http://localhost:3000/trendingAlbums", {
                headers: { Authorization: token },
              })
            : axios.get("http://localhost:3000/trendingAlbums"); // No auth for guests

          promises.push(albumsRequest);
        }

        if (promises.length > 0) {
          const results = await Promise.all(promises);
          console.log(results);

          // Set user if we fetched user data
          if (userPromiseIndex !== -1 && results[userPromiseIndex]) {
            setUser(results[userPromiseIndex].data.user);
          }

          // Set albums if we fetched albums data
          if (albumsPromiseIndex !== -1 && results[albumsPromiseIndex]) {
            setAlbums(results[albumsPromiseIndex].data);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      }
    }

    fetchData();
  }, []); // Empty dependency array to run only once

  if (loading) {
    return <p className="text-white p-8">Loading...</p>;
  }

  if (error && !albums) {
    return <p className="text-white p-8">Error: {error}</p>;
  }

  return (
    <Fragment>
      {albums ? (
        <div>
          <Header user={user} setUser={setUser} />
          <Browse genre="Trending" list={albums} />
          {user ? (
            <div></div>
          ) : (
            <div>
              <ListenList />
            </div>
          )}
        </div>
      ) : (
        <p className="text-white p-8">Data not available</p>
      )}
    </Fragment>
  );
}
