import mongoose from "mongoose";

// Enum for post status (e.g., for editorial workflows)
const PostStatus = Object.freeze({
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
});

const postSchema = new mongoose.Schema(
  {
    // Essential Fields
    title: {
      type: String,
      required: true,
      trim: true,
      index: true, // Add indexing for faster title searches
    },
    slug: { // SEO/URL friendly identifier
      type: String,
      required: true,
      unique: true, // Must be unique for URLs
      trim: true,
      lowercase: true,
      index: true,
    },
    excerpt: { // Short summary for previews/SEO
      type: String,
      trim: true,
      maxlength: 300,
    },
    // Modern Content Handling (Better than simple 'content' string)
    // Use an array of objects to store different block types (e.g., for a block editor like Gutenberg/Draft.js)
    contentBlocks: [
      {
        type: { // e.g., 'paragraph', 'heading', 'image', 'code', 'quote'
          type: String,
          required: true,
        },
        data: mongoose.Schema.Types.Mixed, // Stores the actual data for the block
      },
    ],
    // Traditional 'content' as a fallback or for simple editor use (optional)
    contentMarkdown: {
      type: String,
    },

    // Authoring & Metadata
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Indexing on foreign keys is good practice
    },
    status: {
      type: String,
      enum: Object.values(PostStatus),
      default: PostStatus.DRAFT,
      required: true,
    },
    publishedAt: {
        type: Date,
        // Can be null if status is DRAFT
    },
    // Multimedia Handling (More robust)
    coverImage: { // Main header image
      url: { type: String, trim: true },
      altText: { type: String, trim: true, default: "" },
      mimeType: { type: String },
    },
    // Supporting media (e.g., embedded images, videos, audio)
    mediaAssets: [
      {
        assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Media" }, // Assuming a separate Media model
        url: { type: String, trim: true },
        type: { type: String, enum: ['image', 'video', 'audio', 'document'] },
        caption: { type: String, trim: true },
      },
    ],

    // Categorization & Indexing
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId, // Prefer ID reference to string for scalability
      ref: "Category",
      index: true,
    },

    // Engagement & Social
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Consider adding a 'likeCount' for faster querying without populating
    likeCount: {
        type: Number,
        default: 0,
    },
    comments: [
      {
        // Keeping it simple, but for complex apps, consider a separate Comment model
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        // Nested likes/reactions for comments
        reactions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Future-Proofing & Analytics
    viewCount: { // Basic analytics
      type: Number,
      default: 0,
    },
    aiSummary: { // Space for an AI-generated summary/metadata
      type: String,
    },
    readingTimeMinutes: { // Useful for user experience
        type: Number,
        default: 1,
    }
  },
  { timestamps: true } // Adds 'createdAt' and 'updatedAt' automatically
);

// Pre-save hook to generate slug if not provided (good practice for SEO)
postSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  next();
});

// Compound Index for efficiency: e.g., finding published posts by category, sorted by date.
postSchema.index({ status: 1, category: 1, publishedAt: -1 });

const Post = mongoose.model("Post", postSchema);

export default Post;