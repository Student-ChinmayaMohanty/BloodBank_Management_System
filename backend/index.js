const express = require('express');
const sequelize = require('./Config/database');
const { initializeDatabase } = sequelize;
const serviceRoute = require('./Routes/serviceRoutes');

// Import models to ensure they are synchronized with the database
require('./Models/service');
require('./Models/donorRequest');
require('./Models/contactMessage');
require('./Models/subscriber');
require('./Models/admin');

const app = express();

// CORS Headers Middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Parse JSON request bodies
app.use(express.json());

// API Routes
app.use('/api', serviceRoute);

// Database Initialization and Server Start
async function startServer() {
    await initializeDatabase();
    try {
        await sequelize.sync({ alter: true });
        console.log('Database & tables synced!');
    } catch (err) {
        console.error('Error syncing database:', err.message);
    }

    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`Backend server is running on http://localhost:${PORT}`);
    });
}

startServer();