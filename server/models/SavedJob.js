const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId:     { type: String, required: true },
  title:     String,
  company:   String,
  location:  String,
  url:       String,
  tags:      [String],
  savedAt:   { type: Date, default: Date.now },
});

module.exports = mongoose.model("SavedJob", savedJobSchema);