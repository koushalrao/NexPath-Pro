const express = require("express");
const router  = express.Router();
const axios   = require("axios");
const verifyToken = require("../middleware/verifyToken");
const SavedJob    = require("../models/SavedJob");
const User        = require("../models/User");

// GET /api/jobs?search=developer&location=remote&page=1
router.get("/", async (req, res) => {
  try {
    const { search = "internship", location = "remote", page = 1 } = req.query;

    // Remotive API — free, no key needed
    const response = await axios.get("https://remotive.com/api/remote-jobs", {
      params: {
        search:   `${search} ${location}`.trim(),
        limit:    20,
      },
      timeout: 8000,
    });

    const jobs = response.data.jobs.map((job) => ({
      id:          job.id,
      title:       job.title,
      company:     job.company_name,
      location:    job.candidate_required_location || "Remote",
      tags:        job.tags || [],
      url:         job.url,
      postedAt:    job.publication_date,
      category:    job.category,
      salary:      job.salary || null,
      companyLogo: job.company_logo || null,
    }));

    res.json({ jobs, total: jobs.length, page: Number(page) });
  } catch (err) {
    console.error("Jobs fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch jobs", jobs: [] });
  }
});

// POST /api/jobs/save — save a job (protected)
router.post("/save", verifyToken, async (req, res) => {
  try {
    const { jobId, title, company, location, url, tags } = req.body;

    const existing = await SavedJob.findOne({ userId: req.user.userId, jobId });
    if (existing) return res.json({ message: "Already saved", saved: existing });

    const saved = await SavedJob.create({
      userId: req.user.userId, jobId, title, company, location, url, tags,
    });

    await User.findByIdAndUpdate(req.user.userId, { $push: { savedJobs: saved._id } });

    res.json({ message: "Job saved", saved });
  } catch (err) {
    res.status(500).json({ message: "Failed to save job" });
  }
});

// DELETE /api/jobs/save/:jobId — unsave a job (protected)
router.delete("/save/:jobId", verifyToken, async (req, res) => {
  try {
    const deleted = await SavedJob.findOneAndDelete({
      userId: req.user.userId,
      jobId:  req.params.jobId,
    });
    if (deleted) {
      await User.findByIdAndUpdate(req.user.userId, { $pull: { savedJobs: deleted._id } });
    }
    res.json({ message: "Removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove job" });
  }
});

// GET /api/jobs/saved — get saved jobs (protected)
router.get("/saved", verifyToken, async (req, res) => {
  try {
    const jobs = await SavedJob.find({ userId: req.user.userId }).sort({ savedAt: -1 });
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch saved jobs" });
  }
});

module.exports = router;