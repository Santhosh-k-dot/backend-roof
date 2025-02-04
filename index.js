const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true,              // Allow cookies/credentials
}));
app.use(express.json());            // Parse JSON payloads
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' })); // Using body-parser for JSON parsing
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // Using body-parser for URL-encoded payloads

// Routes
const blogRoute = require('./src/route/blog.route');
const commentRoute = require('./src/route/comment.route');
const userRoute = require('./src/route/auth.user.route');

app.use('/api/auth', userRoute);
app.use('/api/blogs', blogRoute);
app.use('/api/comments', commentRoute);

// Default route 
app.get('/', (req, res) => {
    res.send('Hotel blog server is running.....!');
});

// Ensure MongoDB URL is set
if (!process.env.MONGODB_URL) {
    console.error('MONGODB_URL is not defined in environment variables.');
    process.exit(1);
}

// MongoDB Connection
async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}

main();

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
