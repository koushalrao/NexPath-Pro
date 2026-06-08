const mongoose = require("mongoose");

const savedEventSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId:   { type: String, required: true },
  title:     String,
  organizer: String,
  url:       String,
  deadline:  String,
  savedAt:   { type: Date, default: Date.now },
});

module.exports = mongoose.model("SavedEvent", savedEventSchema);