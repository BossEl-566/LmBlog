import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createPost, deletePost, getAllAuthorPosts, getAllPosts } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createPost);
router.get('/getAll', verifyToken, getAllPosts);
router.get('/:authorId', verifyToken, getAllAuthorPosts);
router.delete('/:postId', verifyToken, deletePost);



export default router;