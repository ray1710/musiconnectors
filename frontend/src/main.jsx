import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Homepage from "./pages/homepage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Homepage></Homepage>
  </StrictMode>
);
