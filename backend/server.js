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

/**
 * New user
 */
app.post("/signup", async (req, res) => {
  const user = req.body;

  let check;
  //Check if User Already Exists
  try {
    check = await User.find({ username: user["username"] }).exec();
  } catch (error) {
    throw error;
  }
  console.log(check);
  if (check != "") {
    res.send("Account Already Exists");
    return;
  }
  const newUser = new User(user);
  try {
    await newUser.save();
    res.send("Sucess");
  } catch (error) {
    res.send("Failed");
  }
});

/**
 * Login currrent user
 */
app.post("/login", async (req, res) => {
  const details = req.body;

  try {
    const user = await User.find(
      { username: details["username"] },
      "username password"
    ).exec();
    if (user == "") {
      res.send("Login Failed");
    } else if (
      details["username"] == user[0]["username"] &&
      details["password"] == user[0]["password"]
    ) {
      res.send("Login Sucessful");
    } else {
      res.send("Login Failed");
    }
  } catch (error) {
    res.status(500);
  }
});
