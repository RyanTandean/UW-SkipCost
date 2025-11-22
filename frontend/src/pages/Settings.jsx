import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Settings() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/');
      return;
    }

    // Fetch profile
    const { data: profileData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    // Fetch courses
    const { data: coursesData } = await supabase
      .from('courses')
      .select('*')
      .eq('user_id', user.id)
      .order('course_code');

    setProfile(profileData);
    setCourses(coursesData || []);
    setLoading(false);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) {
      setError('Failed to delete course');
    } else {
      setCourses(courses.filter(c => c.id !== courseId));
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-cyan-100 to-sky-200 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-cyan-100 to-sky-200 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your profile and courses</p>
        </motion.div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Program</p>
              <p className="font-medium text-gray-800">{profile?.program || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Student Type</p>
              <p className="font-medium text-gray-800 capitalize">{profile?.student_type || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Term</p>
              <p className="font-medium text-gray-800">{profile?.term_number || '-'}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/onboarding')}
            className="mt-4 text-cyan-600 hover:text-cyan-700 text-sm font-medium"
          >
            Update profile →
          </button>
        </motion.div>

        {/* Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Your Courses</h2>
            <span className="text-sm text-gray-500">{courses.length} courses</span>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No courses added yet</p>
              <button
                onClick={() => navigate('/onboarding')}
                className="bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-2 px-6 rounded-xl"
              >
                Add courses
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{course.course_code}</h3>
                    <p className="text-sm text-gray-600">{course.course_name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {course.days_of_week?.join(', ')} • {formatTime(course.start_time)} - {formatTime(course.end_time)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-red-500 hover:text-red-600 p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate('/onboarding')}
            className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-cyan-400 hover:text-cyan-600 transition-colors"
          >
            + Add more courses
          </button>
        </motion.div>

        {/* Back to Dashboard */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-cyan-600 hover:text-cyan-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}