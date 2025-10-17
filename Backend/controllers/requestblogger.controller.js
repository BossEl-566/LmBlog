import BloggerApplication from '../models/requestblogger.model.js';
import User from '../models/user.model.js';

export const applyForBlogger = async (req, res, next) => {
  try {
    // Get the logged-in user ID from verifyToken middleware
    const userId = req.user.id;

    // Prevent duplicate applications
    const existingApplication = await BloggerApplication.findOne({ userId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied.' });
    }

    // Create the new application
    const newApplication = new BloggerApplication({
      userId,  
      fullName: req.body.fullName,
      bio: req.body.bio,
      writingExperience: req.body.writingExperience,
      niche: req.body.niche,
      socialLinks: req.body.socialLinks,
      samplePostUrl: req.body.samplePostUrl,
    });

    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully', newApplication });
  } catch (err) {
    next(err);
  }
};
