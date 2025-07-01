import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/header";
import { useNavigate } from "react-router-dom";

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
      <Header />
      <div className="pt-20">
        {user ? (
          <h1>Welcome, {user.username}</h1>
        ) : (
          <p>Loading user profile...</p>
        )}
      </div>
    </Fragment>
  );
}
