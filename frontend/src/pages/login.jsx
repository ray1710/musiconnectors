import React, { Fragment } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function login() {
  const navigate = useNavigate();
  async function login() {
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    let flag = false;

    if (username.value == "") {
      username.classList.add("border-red-500", "ring-2", "ring-red-500");
      username.placeholder = "Please Enter Username";
      flag = true;
    }
    if (password.value == "") {
      password.classList.add("border-red-500", "ring-2", "ring-red-500");
      password.placeholder = "Please Enter Password";
      flag = true;
    }
    if (flag) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/login", {
        username: username.value,
        password: password.value,
      });

      console.log("Server says:", response.data.message);
      localStorage.setItem("Token", response.data.token);
      navigate("/mainpage");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
    }
  }
  return (
    <Fragment>
      <div className="text-center pt-25">
        <h1 className="mt-6 text-center text-3xl font-extrabold dark:text-white">
          Placeholder
        </h1>
      </div>
      <div className="text-center pt-25 text-white">
        <input
          id="username"
          className="w-full max-w-md px-4 py-2 mt-4 text-white placeholder-gray-300 bg-purple-900 border border-purple-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          type="text"
          placeholder="Username"
        />
      </div>
      <div className="text-center text-white">
        <input
          id="password"
          className="w-full max-w-md px-4 py-2 mt-4 text-white placeholder-gray-300 bg-purple-900 border border-purple-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          type="password"
          placeholder="Password"
        />
      </div>
      <div className="text-center text-white pt-10">
        <button
          onClick={login}
          type="button"
          className="w-32 h-10 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Login
        </button>
      </div>
    </Fragment>
  );
}
