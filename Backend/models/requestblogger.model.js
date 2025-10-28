import mongoose from "mongoose";

// Define an Enum for clarity and easier maintenance
const ApplicationStatus = Object.freeze({
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review', // Added an intermediate stage
  APPROVED: 'approved',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn', // For applicants who pull out
});

const bloggerApplicationSchema = new mongoose.Schema({
    // Core Identity
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // Only one active application per user
        index: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    contactEmail: { // Crucial for communication, might differ from User model's primary email
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    phoneNumber: { // Optional but valuable for quick contact
        type: String,
        trim: true,
    },

    // Content & Expertise
    bio: {
        type: String,
        required: true,
        maxlength: 500, // Enforce a reasonable length
    },
    writingExperience: {
        type: String,
        // Use an array of strings or a separate schema for structured experience if needed
    },
    niches: [ // Use an array to allow for multiple, secondary niches
        {
            type: String,
            trim: true,
            required: true,
            lowercase: true,
        }
    ],

    // Portfolio & Samples (Enhanced)
    socialLinks: { // Use a map/object structure for cleaner access
        website: { type: String, trim: true },
        x_formerly_twitter: { type: String, trim: true }, // Updated platform name
        linkedin: { type: String, trim: true },
        instagram: { type: String, trim: true },
        medium: { type: String, trim: true }, // Common blogging platform
        tiktok: { type: String, trim: true }, // Relevant for content creators
    },
    // Allows for multiple, primary samples (e.g., best 3 posts)
    samplePosts: [
        {
            url: { type: String, required: true },
            title: { type: String, trim: true },
            description: { type: String, trim: true },
        }
    ],

    // Operations & Review
    country: {
        type: String,
        required: true,
        trim: true,
    },
    preferredLanguage: { // Important for multilingual platforms
        type: String,
        default: 'English',
    },
    status: {
        type: String,
        enum: Object.values(ApplicationStatus),
        default: ApplicationStatus.PENDING,
        index: true, // Index for quick filtering by status
    },
    admin: { // Track which admin reviewed the application
        reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reviewDate: { type: Date },
        remarks: { type: String }, // Renamed from adminRemarks for clarity
        // AI-readiness: A field for an AI-generated score or summary
        ai_evaluation_score: { type: Number, min: 0, max: 10, default: 0 },
    },

}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const BloggerApplication = mongoose.model("BloggerApplication", bloggerApplicationSchema);

export default BloggerApplication;