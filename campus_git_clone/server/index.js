import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import groupRoutes from './routes/groups.js';
import eventRoutes from './routes/events.js';

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/groups', groupRoutes);
app.use('/events', eventRoutes);

app.get('/', (req, res) => {
    res.send('Campus Connect API is running');
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
