import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";

dotenv.config();
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.listen(port, () => {
  connectDB();
  console.log(`Listening on port ${port}`);
});
