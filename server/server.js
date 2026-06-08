require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth",   require("./routes/authRoutes"));
app.use("/api/jobs",   require("./routes/jobRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/ai",     require("./routes/aiRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/user",   require("./routes/userRoutes"));

app.get("/", (req, res) => res.json({ message: "NexPath API running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));