import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoute from './routes/auth.route.js';

dotenv.config();



const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGODB).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});


app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});

app.use("/api/auth", authRoute);



app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500; // Default to 500 if no status code is set
    const message = err.message || 'Internal Server Error'; // Default to generic error message
    console.error(err); // Log the error for debugging
    res.status(statusCode).json({ success: false, statusCode, message }); // Send error response
  });