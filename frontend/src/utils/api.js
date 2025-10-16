// Library for making HTTP requests to backend
import axios from 'axios';

// Base URL for the backend API
// Where the Node,js server is running
const API_BASE_URL = 'http://localhost:3001/api';

// CREATE USER
// Recall that async allows us to use await inside the function
// await pauses execution until the promise is resolved
// This is important because HTTP requests are asynchronous
// We want to wait for the response before continuing
export const createUser = async (userData) => {
    // userData looks like: { name: "John", email: "john@uwaterloo.ca", program: "Math", ... }
    
    // axios.post() makes a POST request to your backend
    // First parameter: the full URL (base URL + /users endpoint)
    // Second parameter: the data to send (userData object)
    // wait for the POST request to finish before continuing
    const response = await axios.post(`${API_BASE_URL}/users`, userData);
    
    // response.data contains the JSON response from your backend
    // Use response for immediate feedback
    // Example response: { success: true, user: { id: "abc-123", name: "John", ... } }
    return response.data;
};


// ADD COURSE
export const addCourse = async (courseData) => {
    // courseData looks like: 
    // { 
    //   user_id: "abc-123", 
    //   course_name: "Intro to Stats", 
    //   course_code: "STAT 231",
    //   days_of_week: ["Monday", "Wednesday", "Friday"],
    //   start_time: "10:00:00",
    //   end_time: "11:20:00"
    // }
    
    const response = await axios.post(`${API_BASE_URL}/courses`, courseData);
    
    // Returns: { success: true, course: { id: "def-456", course_name: "Intro to Stats", ... } }
    return response.data;
};

// GET COURSES FOR A USER
export const getCourses = async (userId) => {
    // userId is a string like "abc-123-sf;singlajgr"
    
    // GET request to /api/courses/:userId
    // Example URL: http://localhost:3001/api/courses/abc-123
    const response = await axios.get(`${API_BASE_URL}/courses/${userId}`);
    
    // Returns: { success: true, courses: [ {...}, {...} ] }
    // An array of all courses for this user
    return response.data;
};

// CALCULATE DAILY COST
export const calculateCost = async (userId, date) => {
    // userId: string like "abc-123"
    // date: optional string like "2025-10-14" (if not provided, uses today)
    
    // If date is provided, add it as a query parameter: ?date=2025-10-14
    // If date is null/undefined, dateParam will be an empty string
    const dateParam = date ? `?date=${date}` : '';
    
    // GET request to /api/calculate/:userId with optional date parameter
    // Example URLs:
    //   http://localhost:3001/api/calculate/abc-123
    //   http://localhost:3001/api/calculate/abc-123?date=2025-10-14
    const response = await axios.get(`${API_BASE_URL}/calculate/${userId}${dateParam}`);
    
    // Returns: { 
    //   success: true, 
    //   date: "2025-10-14",
    //   dayOfWeek: "Monday",
    //   totalCost: "37.94",
    //   fairShare: { ... },
    //   individualValue: { ... }
    // }
    return response.data;
};