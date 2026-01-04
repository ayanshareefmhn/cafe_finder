import express from "express";
import Favorite from "../models/Favorite.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Add favorite
router.post("/", verifyToken, async (req, res) => {
  try {
    // Safety check: ensure token verification worked
    if (!req.user || !req.user.userEmail) {
      return res.status(401).json({ message: "Invalid or missing user token" });
    }

    const { place_id, name, fullName, lat, lon } = req.body;
    const userEmail = req.user.userEmail;

    if (!lat || !lon) {
      return res.status(400).json({ message: "Invalid cafe data" });
    }

    // ✅ Generate fallback ID if missing
    const uniqueId = place_id || `${lat}-${lon}`;

    const existing = await Favorite.findOne({ userEmail, place_id: uniqueId });
    if (existing) {
      return res.status(400).json({ message: "Already added to favorites" });
    }

    const favorite = new Favorite({
      userEmail,
      place_id: uniqueId,
      name,
      fullName,
      lat,
      lon,
    });

    await favorite.save();
    res.status(201).json({ message: "Added to favorites", favorite });
  } catch (error) {
    console.error("🔥 Error adding favorite:", error.message);
    res.status(500).json({ message: "Server error while adding favorite" });
  }
});

// ✅ Get favorites for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    if (!req.user || !req.user.userEmail) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userEmail = req.user.userEmail;
    const favorites = await Favorite.find({ userEmail });
    res.json(favorites);
  } catch (error) {
    console.error("🔥 Error fetching favorites:", error.message);
    res.status(500).json({ message: "Error fetching favorites" });
  }
});

// ✅ Remove favorite by ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Favorite.findByIdAndDelete(req.params.id);
    res.json({ message: "Favorite removed" });
  } catch (error) {
    console.error("🔥 Error removing favorite:", error.message);
    res.status(500).json({ message: "Error removing favorite" });
  }
});

export default router;
