const express = require("express");
const router  = express.Router();
const admin   = require("firebase-admin");
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");
const path    = require("path");

if (!admin.apps.length) {
  const serviceAccount = require(path.join(__dirname, "../serviceAccount.json"));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// POST /api/auth/google-login
// Body: { idToken } — the Firebase ID token from the client
router.post("/google-login", async (req, res) => {
  try {
    const { idToken } = req.body;

    // Verify with Firebase Admin
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, name, email, picture } = decoded;

    // Upsert user in MongoDB
    let user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { name, email, photoURL: picture },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Issue our own JWT
    const token = jwt.sign(
      { userId: user._id, firebaseUid: uid, email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Authentication failed" });
  }
});

module.exports = router;