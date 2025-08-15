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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("Token");
        if (!token) {
          navigate("/");
          return;
        }

        const promises = [];

        // Only fetch user if not already loaded
        if (!user) {
          promises.push(
            axios.get("http://localhost:3000/currentuser", {
              headers: { Authorization: token },
            })
          );
        }

        // Only fetch albums if not already loaded
        if (!albums) {
          promises.push(
            axios.get("http://localhost:3000/trendingAlbums", {
              headers: { Authorization: token },
            })
          );
        }

        if (promises.length > 0) {
          const results = await Promise.all(promises);

          let resultIndex = 0;
          console.log(results);
          if (!user && results[resultIndex]) {
            setUser(results[resultIndex].data.user);
            resultIndex++;
          }

          if (!albums && results[resultIndex]) {
            setAlbums(results[resultIndex].data);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
        if (err.response?.status === 401) {
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []); // Empty dependency array to run only once

  if (loading) {
    return <p className="text-white p-8">Loading user profile...</p>;
  }

  if (error) {
    return <p className="text-white p-8">Error: {error}</p>;
  }

  return (
    <Fragment>
      {user && albums ? (
        <div>
          {/* Your actual content here */}
          <Header />
          <Browse genre="Trending" list={albums}></Browse>
        </div>
      ) : (
        <p className="text-white p-8">Data not available</p>
      )}
    </Fragment>
  );
}
