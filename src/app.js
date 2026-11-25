const express = require('express');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const userRoutes = require('./routes/user.routes');

const {
    notFound,
    errorHandler
} = require('./middleware/error');

const app = express();

app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to CampusTrack',
        description: 'Student Assignment and Deadline Management System'
    });
});

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