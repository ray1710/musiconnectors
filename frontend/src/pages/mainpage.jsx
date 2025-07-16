import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Album from "../components/album";

export default function MainPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

    getProfile();
  }, []);

  return (
    <Fragment>
      <h1 className="mt-6 text-center text-3xl font-extrabold dark:text-white p-8">
        Placeholder
      </h1>
      {user ? (
        <div className="p-8 dark:text-white">
          <h1 className="text-2xl mb-4 text-center">
            Welcome, {user.username}
          </h1>
          <div className="flex flex-col items-center gap-6">
            <Album
              name="GNX"
              img="https://i.scdn.co/image/ab67616d00001e02d9985092cd88bffd97653b58"
            />
          </div>
        </div>
      ) : (
        <p>Loading user profile...</p>
      )}
    </Fragment>
  );
}
