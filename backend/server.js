const express = require('express'); // Framework for building APIs
const cors = require('cors'); // Allows frontend to talk to backend
const { Pool } = require('pg'); // PostgreSQL library in node.js
require('dotenv').config(); // Load .env variables, password stays private

const app = express(); // Create server

// Database connection
// Pool is for managing multiple database connections efficiently
// Its a group of reusable database connections
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Test database connection on startup
// SELECT NOW() is a SQL command to return current time
// (err, res) is a callback function that runs when the query finishes
// err = error object, if something went wrong
// res = result object, which contains the data from the database
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Database connection error:', err);
    } else {
        console.log('✅ Database connected at:', res.rows[0].now); // extracts timestamp from result
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
// GET request, "safe"
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'Server is running!',
        message: 'Your first API endpoint works!' 
    });
});

// Create a new user
// POST request, creating new data
app.post('/api/users', async (req, res) => {
    // Extract data from the POST request
    const { email, program, tuition_cost, num_courses } = req.body;

    /*
    {
     "email": "test@uwaterloo.ca",
     "program": "Data Science",
     "tuition_cost": 15000,
     "num_courses": 5
    }
    */
  
    try {
        // run SQL command for our database pool and wait for it to finish
        const result = await pool.query(
            'INSERT INTO users (email, program, tuition_cost, num_courses) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, program, tuition_cost, num_courses]
        );
        // send JSON back to whoever made the request
        res.json({
            success: true,
            user: result.rows[0]
        });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ 
            success: false, 
            error: err.message 
        });
    }
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});