import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";

export default function MainPage() {
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
      }
    }

    getProfile();
  }, []);

  return (
    <Fragment>
      {user ? (
        <h1>Welcome, {user.username}</h1>
      ) : (
        <p>Loading user profile...</p>
      )}
    </Fragment>
  );
}
