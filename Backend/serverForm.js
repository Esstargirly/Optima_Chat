import express from "express"; 
import cors from "cors";
import mongoose from "mongoose"
import User from "./db.js";
import bcrypt from "bcrypt";  
import dotenv from "dotenv";
import path from "path";

dotenv.config()

const app = express()
//app.use(express.static(path.join(__dirname, "../frontend")));
app.use(cors({origin:["http://127.0.0.1:5500"], allowedHeaders: "*"}))
app.use(express.json())
app.use(express.urlencoded ({extended: true}));
app.use(express.static("Frontend"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DataBase connected Successfuly"))
  .catch(err => console.log("DataBase error:", err));

app.get("/", (req, res) => {
    res.sendFile(path.resolve("Frontend/userForm.html"))
})

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.json({ message: "Signup successful", redirect: "/Frontend/chat.html" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    res.json({ message: "Login successful", redirect: "/Frontend/chat.html" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
app.listen (3000, () => console.log("Server is running on http://localhost:3000"));
