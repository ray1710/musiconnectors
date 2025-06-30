import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import { connectDB } from "./db.js";
import User from "./models/user.model.js";

dotenv.config();
const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

export async function getSpotifyToken() {
  try {
    const tokenRes = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({ grant_type: "client_credentials" }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
            ).toString("base64"),
        },
      }
    );

    console.log("Spotify Access Token:", tokenRes.data.access_token); // Debug
    return tokenRes.data.access_token;
  } catch (error) {
    console.error("Token Error:", error.response?.data || error.message);
    throw error;
  }
}

const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(403).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(auth, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid" });
  }
};

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.get("/currentuser", verifyToken, (req, res) => {
  res.status(200).json({ message: "This is protected", user: req.user });
});

/**
 * New user
 */
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  let usernameCheck;
  let emailCheck;
  //Check if User Already Exists
  try {
    usernameCheck = await User.find({ username }).exec();
    emailCheck = await User.find({ email }).exec();
  } catch (error) {
    throw error;
  }

  if (usernameCheck != "" || emailCheck != "") {
    res.json({ message: "Invalid Account Creation" });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(200).json({ message: "Valid Account Creation" });
  } catch (error) {
    res.status(500).json({ message: "Invalid Account Creation" });
  }
});

/**
 * Login currrent user
 */
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).exec();
  if (!user) {
    res.status(500).send("No User");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(500).send("Error");
  }
  const token = jwt.sign(
    { id: user._id, username: user.username },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.json({ message: "Correct", token });
});
/**
app.get("/genres", async (req, res) => {
  const token = await getSpotifyToken();

  const response = await axios.get(
    "https://api.spotify.com/v1/recommendations/available-genre-seeds",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  res.json(response.data);
});
**/

app.listen(port, () => {
  connectDB();
  console.log(`Listening on port ${port}`);
});
