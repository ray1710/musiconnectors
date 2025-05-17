import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";

export default function homepage() {
  const navigate = useNavigate();

  function login() {
    navigate("/login");
  }

  function signUp() {
    navigate("/signup");
  }
  return (
    <Fragment>
      <div className="translate-y-15 ">
        <div className="text-center pt-50">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Placeholder
          </h1>
        </div>
        <div className="text-center translate-y-10">
          <button
            type="button"
            onClick={login}
            className="w-32 h-10 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Login
          </button>
        </div>
        <div className="text-center translate-y-15">
          <button
            type="button"
            onClick={signUp}
            className="w-32 h-10 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Signup
          </button>
        </div>
      </div>
    </Fragment>
  );
}
