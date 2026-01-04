import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  place_id: { type: String, required: true },
  name: String,
  fullName: String,
  lat: String,
  lon: String,
});

favoriteSchema.index({ userEmail: 1, place_id: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);
export default Favorite;
