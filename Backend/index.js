import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();



const app = express();
mongoose.connect(process.env.MONGODB).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});


app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});