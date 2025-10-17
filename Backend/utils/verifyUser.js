import jwt from 'jsonwebtoken';
import { errorHandler } from './errorHandler.js';

export const verifyToken = (req, res, next) => {
  // Try cookie first
  let token = req.cookies.access_token;

  // If not in cookie, try Authorization header (Bearer token)
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  // If still no token found
  if (!token) {
    return next(errorHandler(401, 'Access Denied'));
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(401, 'Unauthorized'));
    req.user = user;
    next();
  });
};
