require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await connectDB(process.env.MONGO_URI);

        const server = app.listen(PORT, () =>
            console.log(`CampusTrack server running on http://localhost:${PORT}`)
        );

        const shutdown = async (signal) => {
            console.log(`\n${signal} received. Closing...`);

            server.close(async () => {
                await mongoose.connection.close();
                process.exit(0);
            });
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));

    } catch (err) {
        console.error('Failed to start:', err.message);
        process.exit(1);
    }
}

start();

process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err);
    process.exit(1);
});