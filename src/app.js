const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const userRoutes = require('./routes/user.routes');

const {
    notFound,
    errorHandler
} = require('./middleware/error');

const app = express();

// SECURITY MIDDLEWARE
app.use(helmet());
app.use(cors());

// RATE LIMITING
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests. Try again later.'
    }
});

app.use('/api', limiter);

// JSON BODY PARSER
app.use(express.json({ limit: '10kb' }));

// HOME ROUTE
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to CampusTrack',
        description: 'Student Assignment and Deadline Management System'
    });
});

// HEALTH CHECK
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime()
    });
});

// API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// ERROR HANDLING
app.use(notFound);
app.use(errorHandler);

module.exports = app;