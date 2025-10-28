import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { applyForBlogger, getAllApplications, updateApplicationStatus } from '../controllers/requestblogger.controller.js';

const router = express.Router();

router.post('/apply', verifyToken, applyForBlogger);
router.get('/applications', verifyToken, getAllApplications);
router.post('/update-status/:applicationId', verifyToken, updateApplicationStatus);

export default router;
