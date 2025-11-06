import Post from "../models/post.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import Category from "../models/category.model.js";

export const createPost = async (req, res, next) => {
  if (!req.user.isAuthor) {
    return next(errorHandler(403, 'You are not authorized to perform this action'));
  }

  if (!req.body.title || !req.body.contentMarkdown) {
    return res.status(400).json({ message: 'Title and content are required to create a post.' });
  }

  try {
    const slug = req.body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existingPost = await Post.findOne({ slug });
    if (existingPost) req.body.slug = slug + '-' + Math.random().toString(36).substring(2, 7);
    else req.body.slug = slug;

    let categoryId = req.body.category;
const categoryDoc = await Category.findOne({ name: req.body.category.toLowerCase() });
if (!categoryDoc) {
  const newCategory = await Category.create({ name: req.body.category });
  categoryId = newCategory._id;
} else {
  categoryId = categoryDoc._id;
}

const newPost = new Post({
    ...req.body,
    category: categoryId,
    author: req.user.id,
  });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
    if (!req.user.isAdmin && !req.user.isAuthor) {
      return next(errorHandler(403, 'You are not authorized to perform this action'));
    }
    try {
      const posts = await Post.find()
        .populate('author', 'username email profilePicture')
        .populate('category', 'name slug')
        .sort({ createdAt: -1 });
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
    };

export const getAllAuthorPosts = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.authorId) {
    return next(errorHandler(403, 'You are not authorized to perform this action'));
  }
    try {
        const posts = await Post.find({ author: req.params.authorId })
        .populate('author', 'username email profilePicture')
        .populate('category', 'name slug')
        .sort({ createdAt: -1 });
      res.status(200).json(posts);
    }
    catch (error) {
        next(error);
    }
    };

export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin && !req.user.isAuthor) {
    return next(errorHandler(403, 'You are not authorized to perform this action'));
  }
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return next(errorHandler(404, 'Post not found'));
        }   
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    }
    catch (error) {
        next(error);
    }
    };


export const editpost = async (req, res, next) => {
  if (!req.user.isAdmin && !req.user.isAuthor) {
    return next(errorHandler(403, 'You are not authorized to perform this action'));
  }
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return next(errorHandler(404, 'Post not found'));
        }
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
            $set: req.body,
        }, { new: true });
        res.status(200).json(updatedPost);
    }
    catch (error) {
        next(error);
    }
    };

export const getPostById = async (req, res, next) => {
  if (!req.user.isAdmin && !req.user.isAuthor) {
    return next(errorHandler(403, 'You are not authorized to perform this action'));
  }
    try {
        const post = await Post.findById(req.params.postId) 
        if (!post) {
            return next(errorHandler(404, 'Post not found'));
        }
        res.status(200).json(post);
    }
    catch (error) {
        next(error);
    }
    };

export const publishPost = async (req, res, next) => {
  if (!req.user.isAdmin && !req.user.isAuthor) {
    return next(errorHandler(403, 'You are not authorized to perform this action'));
  }
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return next(errorHandler(404, 'Post not found'));
        }
        post.status = 'published';
        post.publishedAt = new Date();
        const publishedPost = await post.save();
        res.status(200).json(publishedPost);
    }
    catch (error) {
        next(error);
    }
    };