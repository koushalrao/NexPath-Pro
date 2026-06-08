const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name:         { type: String },
  email:        { type: String, required: true },
  photoURL:     { type: String },
  savedJobs:    [{ type: mongoose.Schema.Types.ObjectId, ref: "SavedJob" }],
  savedEvents:  [{ type: mongoose.Schema.Types.ObjectId, ref: "SavedEvent" }],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);