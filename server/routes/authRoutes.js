const express = require("express");
const router  = express.Router();
const admin   = require("firebase-admin");
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");
const path    = require("path");

if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } else {
    const serviceAccount = require(path.join(__dirname, "../serviceAccount.json"));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  }
}

// POST /api/auth/google-login
router.post("/google-login", async (req, res) => {
  try {
    const { idToken } = req.body;

    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, name, email, picture } = decoded;

    let user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { name, email, photoURL: picture },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

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