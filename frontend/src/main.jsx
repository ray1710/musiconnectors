import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Homepage from "./pages/homepage";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Mainpage from "./pages/mainpage";
import Customize from "./pages/customize";
import Albumpage from "./pages/albumpage";
import Profile from "./pages/profile";
import { AlbumProvider } from "./context/albumContext";
import { UserProvider } from "./context/userContext";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <AlbumProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mainpage" element={<Mainpage />} />
          <Route path="/customize" element={<Customize />} />
          <Route path="/album/:id" element={<Albumpage />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </AlbumProvider>
  </UserProvider>
);
