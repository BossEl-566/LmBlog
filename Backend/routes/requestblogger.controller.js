import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { applyForBlogger } from '../controllers/requestblogger.controller.js';

const router = express.Router();

router.post('/apply', verifyToken, applyForBlogger);

export default router;
