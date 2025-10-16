import { useState } from 'react';
import { createUser } from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
    // useNavigate lets us redirect to other pages
    //const navigate = useNavigate();
    const [formData, setFormData] = useState({
    name: '',
    email: '',
    program: '',
    student_type: 'domestic',  // Default to domestic
    term_number: null
    });
    
    const handleChange = (e) => {
        // e.target = the input field that was changed
        // e.target.name = the "name" attribute (e.g., "name", "email", "program")
        // e.target.value = what the user typed
        const { name, value } = e.target;
        
        // Update formData, keeping all other fields the same
        // Only update the field that changed
        setFormData(prev => ({
        ...prev,        // Spread operator: keep all existing fields
        [name]: value   // Update only this field
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // No page reload
        try {
            // Call our API to create user in database
            const result = await createUser(formData);
            // Recall that result.success is a boolean in the response object
            if (result.success) {
                // Save user ID to browser's localStorage
                // Persists if user closes browser
                localStorage.setItem('userId', result.user.id);
                // Redirect
               // navigate('/add-courses');
            }
        } catch (error) {
            // If something goes wrong (network error, server error, etc.)
            console.error('Error creating user:', error);
            alert('Failed to create user. Please try again.');
        }
    };
    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Card container */}
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to UW Class Cost
        </h1>
        <p className="text-gray-600 mb-6">
          Let's calculate how much your classes are worth
        </p>

        {/* Form - calls handleSubmit when submitted */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              name="name"  // Must match key in formData
              value={formData.name}  // Controlled input - React controls value
              onChange={handleChange}  // Update state when user types
              required  // HTML5 validation - can't submit if empty
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (optional)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              // No "required" - it's optional
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@uwaterloo.ca"
            />
          </div>

          {/* Program Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Program
            </label>
            <select
              name="program"
              value={formData.program}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select your program</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Computing & Financial Management">Computing & Financial Management</option>
              <option value="Science">Science</option>
            </select>
          </div>

          {/* Student Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Type
            </label>
            <select
              name="student_type"
              value={formData.student_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="domestic">Domestic (Ontario)</option>
              <option value="domestic out of province">Domestic (Out of Province)</option>
              <option value="international">International</option>
            </select>
          </div>

          {/* Term Number Input (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Term Number (if co-op)
            </label>
            <input
              type="text"
              name="term_number"
              value={formData.term_number || ''}  // Show empty string if null
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 1A, 2A (leave blank if not co-op)"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue →
          </button>
        </form>
      </div>
    </div>
  );
}


