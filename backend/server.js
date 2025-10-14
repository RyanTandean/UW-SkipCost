

// Import required modules
const express = require('express'); // Express: web framework for building REST APIs
const cors = require('cors'); // CORS: enables cross-origin requests (frontend <-> backend)
const { Pool } = require('pg'); // pg: PostgreSQL client for Node.js
require('dotenv').config(); // dotenv: loads environment variables from .env file


// Term dates for 2024-2025 academic year
// Really should web scrape this, check if API is ready from waterloo in 2026
const TERM_DATES = {
  'Fall 2025': {
    start: '2025-09-03', // Classes start
    end: '2025-12-02' // Classes end
  },
  'Winter 2026': {
    start: '2026-01-05',
    end: '2026-04-06'
  },
  'Spring 2026': {
    start: '2026-05-11',
    end: '2026-08-05'
  }
};

// Returns the current term name based on today's date
function getCurrentTerm() {
    const today = new Date().toISOString().split('T')[0]; // e.g. "2025-10-13"
    let currentTerm = null;
    // Iterate through terms and find the latest one that has started
    for (const [termName, dates] of Object.entries(TERM_DATES)) {
        if (today >= dates.start) {
            currentTerm = termName;
        }
    }
    return currentTerm;
}

// --- Express App Setup ---
const app = express(); // Create Express server instance

// Database connection
// Pool is for managing multiple database connections efficiently
// Its a group of reusable database connections
const pool = new Pool({
    connectionString: process.env.DATABASE_URL // Set in .env file
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
        console.log('✅ Database connected at:', res.rows[0].now); // extracts timestamp from response
    }
});
// --- Middleware ---
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// --- Health Check Endpoint ---
// Simple GET endpoint to verify server is running
app.get('/api/health', (req, res) => {
    res.json({
        status: 'Server is running!',
        message: 'Your first API endpoint works!'
    });
});

// --- Create User Endpoint ---
// POST /api/users: Adds a new user to the database
app.post('/api/users', async (req, res) => {
    // Extract user info from request body
    const { name, email, program, student_type, term_number } = req.body;

    /*
    Example request body:
    {
     "name": "Ryan Tandean",
     "email": "rtandean@uwaterloo.ca",
     "program": "Data Science",
     "student_type": "domestic",
     "term_number": "2A"
    }
    */
  
    try {
        // Insert user into database and return the new user
        const result = await pool.query(
            'INSERT INTO users (name, email, program, student_type, term_number) VALUES ($1, $2, $3, $4, $5) RETURNING *',
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
// --- Create Course Endpoint ---
// POST /api/courses: Adds a new course for a user
app.post('/api/courses', async (req, res) => {
    const { user_id, course_name, course_code, days_of_week, start_time, end_time } = req.body;
  
    try {
        // Insert course into database and return the new course
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
// --- Tuition Calculation Endpoint ---
// GET /api/calculate/:userId: Calculates tuition cost breakdown for a user on a given date
app.get('/api/calculate/:userId', async (req, res) => {
    const { userId } = req.params;
    // Use query param 'date' or default to today
    const date = req.query.date || new Date().toISOString().split('T')[0];
  
    try {
        // 1. Get day of week for the given date
        const dateObj = new Date(date + 'T12:00:00'); // Noon avoids timezone issues
        const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

        // 2. Fetch user from database
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        const user = userResult.rows[0];

        // 3. Determine current term
        const currentTerm = await getCurrentTerm();

        // 4. Fetch tuition rates for this user/term
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

        // 5. Get all courses for this user
        const allCoursesResult = await pool.query(
            'SELECT * FROM courses WHERE user_id = $1 ORDER BY created_at',
            [userId]
        );
        const allCourses = allCoursesResult.rows;

        // 6. Calculate total tuition for the term
        let totalTuition = 0;
        allCourses.forEach((course, index) => {
            const position = index + 1;
            // First 4 courses use course_1_4_cost, others use course_5_plus_cost
            const courseCost = position <= 4 ? rates.course_1_4_cost : rates.course_5_plus_cost;
            totalTuition += courseCost;
        });

        // 7. Find courses happening on the given day
        const todaysCourses = allCourses.filter(c => c.days_of_week.includes(dayOfWeek));

        // 8. Calculate total number of sessions (all courses, all days)
        let totalSessions = 0;
        allCourses.forEach(course => {
            totalSessions += course.days_of_week.length * 12; // 12 weeks per term
        });

        // 9. Calculate fair share cost (total tuition / total sessions)
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

        // 10. Calculate individual value (per-course costs)
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

        // 11. Return calculation results
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
// --- Start Server ---
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});