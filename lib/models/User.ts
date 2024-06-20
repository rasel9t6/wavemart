import mongoose from "mongoose";
const useSchema = new mongoose.Schema({
  clerkId: String,
  wishlist: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const User = mongoose.models.User || mongoose.model("User", useSchema);
export default User;
