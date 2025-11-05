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
