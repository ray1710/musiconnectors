import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "./db.js";
import User from "./models/user.model.js";

dotenv.config();
const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

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
  const { username, password } = req.body;

  let check;
  //Check if User Already Exists
  try {
    check = await User.find({ username }).exec();
  } catch (error) {
    throw error;
  }

  if (check != "") {
    res.send("Account Already Exists");
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  try {
    await newUser.save();
    res.status(200).send("Sucess");
  } catch (error) {
    res.status(500).send("Failed");
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

app.listen(port, () => {
  connectDB();
  console.log(`Listening on port ${port}`);
});
