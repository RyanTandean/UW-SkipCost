const express = require('express'); // Framework for building APIs
const cors = require('cors'); // Allows frontend to talk to backend
const { Pool } = require('pg'); // PostgreSQL library in node.js
require('dotenv').config(); // Load .env variables, password stays private

// Get current term from UWaterloo API
async function getCurrentTerm() {
    try {
        const response = await fetch('https://api.uwaterloo.ca/v3/Terms/list', {
        headers: {
            'X-API-Key': process.env.UW_API_KEY || ''
        }
        });
        
        if (!response.ok) {
        throw new Error('Failed to fetch terms from UW API');
        }
        
        const data = await response.json();
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Find which term we're currently in
        const currentTerm = data.data.find(term => {
            return today >= term.startDate && today <= term.endDate;
        });
        
        if (currentTerm) {
            return currentTerm.name; // "Fall 2025", "Winter 2026", etc.
        }
        
        // Fallback if we're between terms (shouldn't happen often)
        console.warn('Not currently in an active term, using fallback');
        return fallbackGetCurrentTerm();
        
    } catch (err) {
        console.error('Error fetching current term from UW API:', err);
        // Fallback to simple month-based logic
        return fallbackGetCurrentTerm();
    }
}

function fallbackGetCurrentTerm() {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    
    if (month >= 0 && month <= 3) {
        return `Winter ${year}`;
    } else if (month >= 4 && month <= 7) {
        return `Spring ${year}`;
    } else {
        return `Fall ${year}`;
    }
}



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
    const { name, email, program, student_type, term_number} = req.body;

    /*
    {
     "name": "Ryan"
     "email": "test@uwaterloo.ca",
     "program": "Data Science",
     "program_type": ,
     "num_courses": 5
    }
    */
  
    try {
        // run SQL command for our database pool and wait for it to finish
        const result = await pool.query(
            'INSERT INTO users (name, email, program, tudent_type, term_number) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, program, student_type, term_number]
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

app.post('/api/courses', async (req, res) => {
    const { user_id, course_name, course_code, days_of_week, start_time, end_time } = req.body;
  
    try {
        const result = await pool.query(
            'INSERT INTO courses (user_id, course_name, course_code, days_of_week, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [user_id, course_name, course_code, days_of_week, start_time, end_time]
        );
    
    res.json({
        success: true,
        course: result.rows[0]
    });
    } catch (err) {
        console.error('Error creating course:', err);
        res.status(500).json({ 
            success: false, 
            error: err.message 
        });
    }
});
app.get('/api/calculate/:userId', async (req, res) => {
    const { userId } = req.params;
    const date = req.query.date || new Date().toISOString().split('T')[0];
  
    try {
        // Get day of week
        const dateObj = new Date(date + 'T12:00:00');
        const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        // Get user
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'User not found' });
        }
        const user = userResult.rows[0];
        // Get current term
        const currentTerm = await getCurrentTerm();
        
        // Get tuition rates for this user
        const ratesResult = await pool.query(
            `SELECT * FROM tuition_rates 
            WHERE program = $1 
            AND program_type = $2 
            AND student_type = $3 
            AND term = $4 
            AND (term_number = $5 OR (term_number IS NULL AND $5 IS NULL))`,
            [user.program, user.program_type, user.student_type, currentTerm, user.term_number]
        );
        if (ratesResult.rows.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: `Tuition rates not found for ${user.program} (${user.student_type}, ${currentTerm})` 
            });
        }
        const rates = ratesResult.rows[0];

        // Get all courses for this user
        const allCoursesResult = await pool.query(
        'SELECT * FROM courses WHERE user_id = $1 ORDER BY created_at',
        [userId]
        );
        const allCourses = allCoursesResult.rows;
        
        // Calculate total tuition for the term
        let totalTuition = 0;
        allCourses.forEach((course, index) => {
            const position = index + 1;
            const courseCost = position <= 4 ? rates.course_1_4_cost : rates.course_5_plus_cost;
            totalTuition += courseCost;
        });

        // Get courses happening today
        const todaysCourses = allCourses.filter(c => c.days_of_week.includes(dayOfWeek));
        
        // 1. Calculate fair share (total tuition / all sessions)
        const fairShareCostPerSession = totalSessions > 0 ? totalTuition / totalSessions : 0;
        const fairShare = {
        costPerSession: fairShareCostPerSession.toFixed(2),
        missedClasses: todaysCourses.map(course => ({
            course_name: course.course_name,
            course_code: course.course_code,
            time: `${course.start_time} - ${course.end_time}`,
            cost: fairShareCostPerSession.toFixed(2)
            })),
            totalCost: (fairShareCostPerSession * todaysCourses.length).toFixed(2)
        };

        // 2. Calculate individual value (per-course costs)
        const individualValue = {
            missedClasses: todaysCourses.map((course, todayIndex) => {
                const courseIndex = allCourses.findIndex(c => c.id === course.id);
                const position = courseIndex + 1;
                const courseCost = position <= 4 ? rates.course_1_4_cost : rates.course_5_plus_cost;
                const sessionsPerCourse = course.days_of_week.length * 12;
                const costPerSession = courseCost / sessionsPerCourse;
                
                return {
                    course_name: course.course_name,
                    course_code: course.course_code,
                    course_number: position,
                    time: `${course.start_time} - ${course.end_time}`,
                    courseCost: courseCost.toFixed(2),
                    costPerSession: costPerSession.toFixed(2)
                };
            })
        };
        let individualTotal = 0;
        for (let i = 0; i < individualValue.missedClasses.length; i++) {
        individualTotal += parseFloat(individualValue.missedClasses[i].costPerSession);
        }
        individualValue.totalCost = individualTotal.toFixed(2);

        res.json({
            success: true,
            date,
            dayOfWeek,
            totalTuition: totalTuition.toFixed(2),
            totalSessions,
            fairShare,
            individualValue
        });
    
    } catch (err) {
    console.error('Error calculating cost:', err);
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