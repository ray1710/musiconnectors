import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import User from "./models/user.model.js";

dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.listen(port, () => {
  connectDB();
  console.log(`Listening on port ${port}`);
});

app.post("/newuser", async (req, res) => {
  const user = req.body;

  const newUser = new User(user);
  try {
    await newUser.save();
    res.send("Sucess");
  } catch (error) {
    res.send("Failed");
  }
});
