import mongoose from "mongoose";

const bloggerApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  writingExperience: {
    type: String, // Example: "2 years writing tech blogs"
    required: true
  },
  niche: {
    type: String, // Example: "Technology", "Lifestyle", etc.
    required: true
  },
  socialLinks: {
    website: String,
    twitter: String,
    linkedin: String,
    instagram: String
  },
  samplePostUrl: {
    type: String, // optional: link to past work or uploaded sample
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  adminRemarks: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("BloggerApplication", bloggerApplicationSchema);
