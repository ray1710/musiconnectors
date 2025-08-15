import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  age: Number,
  genres: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likedAlbums: [Object],
  favSong: String,
  favArtist: String,
  favLyric: String,
});

const User = mongoose.model("User", userSchema);
export default User;
