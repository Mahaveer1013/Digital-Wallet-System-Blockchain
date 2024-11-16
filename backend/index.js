// app.js
import express from 'express';
import bodyParser from 'body-parser';
import { connectDB, sequelize } from './src/config/db.js';
import { userRoutes } from './src/routes/user.route.js';
import { PORT } from './src/utils/constant.js';

// Create express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to the database (SQLite)
connectDB();

// Use user routes
app.use('/api', userRoutes);

// Sync the models with the database
const syncDatabase = async () => {
    try {
        await sequelize.sync(); // Sync models with the database
        console.log('Database synchronized...');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

// Sync database before starting the server
syncDatabase();

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
