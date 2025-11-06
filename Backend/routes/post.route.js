import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createPost, deletePost, editpost, getAllAuthorPosts, getAllPosts, getPostById, publishPost } from '../controllers/post.controller.js';


const router = express.Router();

router.post('/create', verifyToken, createPost);
router.get('/getAll', verifyToken, getAllPosts);
router.get('/:authorId', verifyToken, getAllAuthorPosts);
router.delete('/:postId', verifyToken, deletePost);
router.put('/:postId', verifyToken, editpost);
router.get('/author/:postId', verifyToken, getPostById);
router.put('/publish/:postId', verifyToken, publishPost);



export default router;