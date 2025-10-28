import BloggerApplication from '../models/requestblogger.model.js';
import User from '../models/user.model.js';

// --- 1. Apply for Blogger Role (User Function) ---
export const applyForBlogger = async (req, res, next) => {
    try {
        // Get the logged-in user ID from verifyToken middleware
        const userId = req.user.id;

        // Extract data from request body, matching the new schema
        const {
            fullName,
            contactEmail, // NEW field
            phoneNumber, // NEW field
            bio,
            writingExperience,
            niches, // NEW: Expecting an array
            socialLinks,
            samplePosts, // NEW: Expecting an array of objects
            country, // Moved from optional to required/validated
            preferredLanguage, // NEW field
        } = req.body;

        // Prevent duplicate applications OR applications that are already 'under_review'
        const existingApplication = await BloggerApplication.findOne({
            userId,
            // Only block if an application is active (pending or under review)
            status: { $in: ['pending', 'under_review'] }
        });

        if (existingApplication) {
            return res.status(400).json({ message: `You have an existing application in the '${existingApplication.status}' stage.` });
        }

        // Check if the user is already an author
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // Assuming your User model uses 'isAuthor' for the blogger role
        if (user.isAuthor) {
            return res.status(400).json({ message: 'You are already an author/blogger.' });
        }

        // Create the new application
        const newApplication = new BloggerApplication({
            userId,
            fullName,
            contactEmail,
            phoneNumber,
            bio,
            writingExperience,
            niches,
            socialLinks,
            samplePosts,
            country,
            preferredLanguage,
            // Status defaults to 'pending' as per model
        });

        await newApplication.save();
        res.status(201).json({ message: 'Application submitted successfully. We will review it shortly.', application: newApplication });

    } catch (err) {
        next(err);
    }
};

// --- 2. Get All Applications (Admin Function) ---
export const getAllApplications = async (req, res, next) => {
    // Check for Admin permissions first
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
    }
    try {
        // Use pagination and sorting for a robust admin dashboard
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const statusFilter = req.query.status; // e.g., ?status=pending
        const sortOrder = req.query.sort || 'createdAt'; // Default sort

        const query = statusFilter ? { status: statusFilter } : {};

        const applications = await BloggerApplication.find(query)
            .sort({ [sortOrder]: -1 }) // Sort descending by default
            .skip((page - 1) * limit)
            .limit(limit)
            // Optionally populate the User details for the admin view
            .populate('userId', 'username email');

        const totalApplications = await BloggerApplication.countDocuments(query);

        res.status(200).json({
            total: totalApplications,
            page: page,
            pages: Math.ceil(totalApplications / limit),
            applications
        });
    } catch (err) {
        next(err);
    }
};

// --- 3. Update Application Status (Admin Function) ---
export const updateApplicationStatus = async (req, res, next) => {
    // Check for Admin permissions first
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
    }

    try {
        const { status, remarks, ai_evaluation_score } = req.body;
        const { applicationId } = req.params; // Use URL parameter for ID

        const application = await BloggerApplication.findById(applicationId);
        console.log(applicationId);

        if (!application) {
            return res.status(404).json({ message: 'Application not found.' });
        }

        // Check if the new status is valid (using the enum from the model)
        if (!['pending', 'under_review', 'approved', 'rejected', 'withdrawn'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided.' });
        }

        // 1. Update the application fields
        application.status = status;
        application.admin.reviewerId = req.user.id; // Log the admin who reviewed it
        application.admin.reviewDate = new Date();
        application.admin.remarks = remarks || '';
        if (ai_evaluation_score !== undefined) {
            application.admin.ai_evaluation_score = ai_evaluation_score;
        }

        await application.save();

        // 2. Action based on status change
        if (status === 'approved') {
            // Update the user's role to 'Author/Blogger'
            await User.findByIdAndUpdate(application.userId, { isAuthor: true });
            // You might want to send an approval email here
        } else if (status === 'rejected') {
            // Optional: Log or trigger a notification for rejection
        }

        res.status(200).json({ message: `Application status set to ${status}.`, application });

    } catch (err) {
        next(err);
    }
};

// --- 4. Get Single Application Status (User Function) ---
export const getMyApplicationStatus = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const application = await BloggerApplication.findOne({ userId });

        if (!application) {
            // Return 200 with a message if no application is found, indicating they should apply
            return res.status(200).json({ status: 'none', message: 'You have not submitted a blogger application yet.' });
        }

        // Return only the current status and relevant dates/messages
        res.status(200).json({
            status: application.status,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
            message: `Your application is currently ${application.status}.`,
            // Only show admin remarks if rejected or approved
            ...(application.status === 'rejected' || application.status === 'approved' ? { adminRemarks: application.admin.remarks } : {})
        });
    } catch (err) {
        next(err);
    }
};