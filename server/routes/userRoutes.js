const express = require("express");
const router  = express.Router();
const verifyToken = require("../middleware/verifyToken");
const User        = require("../models/User");
const SavedJob    = require("../models/SavedJob");
const SavedEvent  = require("../models/SavedEvent");

// GET /api/user/profile (protected)
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-__v");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// GET /api/user/dashboard (protected) — all dashboard data in one call
router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const user       = await User.findById(req.user.userId).select("-__v");
    const savedJobs  = await SavedJob.find({ userId: req.user.userId }).sort({ savedAt: -1 }).limit(5);
    const savedEvents= await SavedEvent.find({ userId: req.user.userId }).sort({ savedAt: -1 }).limit(5);

    res.json({ user, savedJobs, savedEvents });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch dashboard" });
  }
});

module.exports = router;