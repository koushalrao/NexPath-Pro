require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://nexpath-pro.vercel.app",        // replace with your actual Vercel URL after deploy
  process.env.CLIENT_URL,                   // set this in Render env vars
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth",   require("./routes/authRoutes"));
app.use("/api/jobs",   require("./routes/jobRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/ai",     require("./routes/aiRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/user",   require("./routes/userRoutes"));

app.get("/", (req, res) => res.json({ message: "NexPath API running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));