import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // ✅ Import cookie-parser
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser()); // <-- Add this line before your routes

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// ✅ Routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);

// ✅ Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error(err);
  res.status(statusCode).json({ success: false, statusCode, message });
});

// ✅ Server listen
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
