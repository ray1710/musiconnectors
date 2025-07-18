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

    return tokenRes.data.access_token;
  } catch (error) {
    console.error("Token Error:", error.response?.data || error.message);
    throw error;
  }
}

export async function getAlbumsFromGenres(genre, token) {
  let artists;
  try {
    const result = await axios.get(
      `https://api.spotify.com/v1/search?q=genre%3A${genre}&type=artist&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    artists = result.data.artists.items;
  } catch (error) {
    console.log("Spotify API Error: Failed to Fetch Artists");
    throw error;
  }
  const artistIds = artists
    .filter((artist) => artist.id)
    .map((artist) => artist.id);
  let albums = [];
  for (let i = 0; i < artistIds.length; i++) {
    try {
      const result = await axios.get(
        `https://api.spotify.com/v1/artists/${artistIds[i]}/albums?include_groups=album&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let items = result.data.items;
      if (items.length != 0) {
        albums.push({
          name: items[0].name,
          artist: getArtistsFromAlbums(items[0].artists),
          num_of_tracks: items[0].total_tracks,
          release_date: items[0].release_date,
          image: items[0].images[1].url,
          id: items[0].id,
        });
      }
    } catch (error) {
      console.log("Spotify API Error: Failed to Fetch Albums");
      throw error;
    }
  }
  return albums;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function getArtistsFromAlbums(arr) {
  let artists = "";
  for (let i = 0; i < arr.length; i++) {
    artists += arr[i].name;
    if (i != arr.length - 1) {
      artists += ", ";
    }
  }
  return artists;
}

function getTracksFromAlbums(tracks) {
  let res = [];
  console.log(tracks);
  for (let i = 0; i < tracks.items.length; i++) {
    res.push({
      track_num: tracks.items[i].track_number,
      track_name: tracks.items[i].name,
      artist: getArtistsFromAlbums(tracks.items[i].artists),
    });
  }
  return res;
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

app.get("/reccommendedAlbums", verifyToken, async (req, res) => {
  const username = req.user.username;
  const user = await User.findOne({ username }).exec();
  const spotifyToken = await getSpotifyToken();
  let genres = user.genres;
  let result = [];

  for (const genre of genres) {
    const albums = await getAlbumsFromGenres(genre, spotifyToken);
    result = result.concat(albums);
  }
  result = await shuffle(result);
  res.status(200).json({ result });
});

app.get("/album/:id", async (req, res) => {
  const token = await getSpotifyToken();

  let album = await axios.get(
    `https://api.spotify.com/v1/albums/${req.params.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  res.status(200).json({
    name: album.data.name,
    artist: getArtistsFromAlbums(album.data.artists),
    num_of_tracks: album.data.total_tracks,
    release_date: album.data.release_date,
    image: album.data.images[1].url,
    id: album.data.id,
    tracks: getTracksFromAlbums(album.data.tracks),
  });
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
app.post("/addCustomizedInfo", verifyToken, async (req, res) => {
  const { genres, song, lyric, artist } = req.body;
  const userID = req.user.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      {
        $set: {
          genres,
          favSong: song,
          favLyric: lyric,
          favArtist: artist,
        },
      },
      { new: true }
    );
    res.status(200).json({ message: "User info updated sucessfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to Updated User Customization" });
  }
});

app.listen(port, () => {
  connectDB();
  console.log(`Listening on port ${port}`);
});
