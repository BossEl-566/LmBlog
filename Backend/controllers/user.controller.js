import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/errorHandler.js';
import User from '../models/user.model.js';




export const signout = (req, res, next) => {
    try {
     res.clearCookie('access_token').status(200).json({ message: 'User has been signed out' });
    } catch (error) {
      next(error);
     
    }
   };




