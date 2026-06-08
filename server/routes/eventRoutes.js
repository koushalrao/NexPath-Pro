const express = require("express");
const router  = express.Router();
const axios   = require("axios");
const verifyToken  = require("../middleware/verifyToken");
const SavedEvent   = require("../models/SavedEvent");
const User         = require("../models/User");

// Curated hackathon list — Devpost & MLH public data
// In production you'd fetch from Devpost RSS; this gives you
// real, working event data with live URLs for the portfolio demo.
const DEMO_EVENTS = [
  {
    id: "smart-india-hackathon-2025",
    title: "Smart India Hackathon 2025",
    organizer: "Government of India",
    description: "National-level hackathon open to all college students across India.",
    url: "https://www.sih.gov.in",
    deadline: "2025-08-31",
    tags: ["Open to all", "India", "Government"],
    prize: "₹1,00,000+",
    status: "upcoming",
  },
  {
    id: "hackmit-2025",
    title: "HackMIT 2025",
    organizer: "MIT",
    description: "MIT's annual hackathon welcoming students worldwide for 24 hours of building.",
    url: "https://hackmit.org",
    deadline: "2025-09-14",
    tags: ["International", "24hr", "MIT"],
    prize: "$10,000+",
    status: "upcoming",
  },
  {
    id: "devfolio-hack-2025",
    title: "Hack This Fall 2025",
    organizer: "Devfolio",
    description: "One of India's largest virtual hackathons, open to all skill levels.",
    url: "https://hackthisfall.tech",
    deadline: "2025-10-05",
    tags: ["Virtual", "India", "Beginner friendly"],
    prize: "₹5,00,000+",
    status: "upcoming",
  },
  {
    id: "mlh-ghw-2025",
    title: "MLH Global Hack Week",
    organizer: "Major League Hacking",
    description: "Weekly themed hacking events by MLH with workshops and prizes.",
    url: "https://ghw.mlh.io",
    deadline: "2025-07-20",
    tags: ["Virtual", "Weekly", "MLH"],
    prize: "Swag + prizes",
    status: "open",
  },
  {
    id: "unstop-hackathon-2025",
    title: "Unstop Hackathon League",
    organizer: "Unstop",
    description: "Aggregated hackathon competitions across top companies on Unstop platform.",
    url: "https://unstop.com/hackathons",
    deadline: "2025-08-15",
    tags: ["India", "Corporate", "Multiple tracks"],
    prize: "Varies",
    status: "open",
  },
  {
    id: "google-solution-challenge-2025",
    title: "Google Solution Challenge 2025",
    organizer: "Google",
    description: "Build solutions for UN Sustainable Development Goals using Google tech.",
    url: "https://developers.google.com/community/gdsc-solution-challenge",
    deadline: "2025-03-31",
    tags: ["Google", "SDGs", "Global"],
    prize: "$3,000 per team",
    status: "upcoming",
  },
];

// GET /api/events
router.get("/", async (req, res) => {
  try {
    const { status, search } = req.query;
    let events = DEMO_EVENTS;

    if (status && status !== "all") {
      events = events.filter((e) => e.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    res.json({ events });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events", events: [] });
  }
});

// POST /api/events/save (protected)
router.post("/save", verifyToken, async (req, res) => {
  try {
    const { eventId, title, organizer, url, deadline } = req.body;

    const existing = await SavedEvent.findOne({ userId: req.user.userId, eventId });
    if (existing) return res.json({ message: "Already saved", saved: existing });

    const saved = await SavedEvent.create({
      userId: req.user.userId, eventId, title, organizer, url, deadline,
    });
    await User.findByIdAndUpdate(req.user.userId, { $push: { savedEvents: saved._id } });

    res.json({ message: "Event saved", saved });
  } catch (err) {
    res.status(500).json({ message: "Failed to save event" });
  }
});

// DELETE /api/events/save/:eventId (protected)
router.delete("/save/:eventId", verifyToken, async (req, res) => {
  try {
    const deleted = await SavedEvent.findOneAndDelete({
      userId:  req.user.userId,
      eventId: req.params.eventId,
    });
    if (deleted) {
      await User.findByIdAndUpdate(req.user.userId, { $pull: { savedEvents: deleted._id } });
    }
    res.json({ message: "Removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove event" });
  }
});

// GET /api/events/saved (protected)
router.get("/saved", verifyToken, async (req, res) => {
  try {
    const events = await SavedEvent.find({ userId: req.user.userId }).sort({ savedAt: -1 });
    res.json({ events });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch saved events" });
  }
});

module.exports = router;