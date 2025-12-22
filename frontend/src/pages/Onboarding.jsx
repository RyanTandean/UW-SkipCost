// pages/Onboarding.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const PROGRAMS = [
  'Mathematics Co-op',
  'Computer Science/Data Science Co-op',
  'Computing & Financial Management Co-op',
  'Science Co-op'
];

const STUDENT_TYPES = [
  { value: 'domestic', label: 'Domestic (Ontario)' },
  { value: 'domestic out of province', label: 'Domestic (Out of Province)' },
  { value: 'international', label: 'International' }
];

const TERM_NUMBERS = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B'];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 data
  const [profile, setProfile] = useState({
    program: '',
    studentType: '',
    termNumber: ''
  });

  // Step 2 data
  const [questText, setQuestText] = useState('');
  const [parsedCourses, setParsedCourses] = useState([]);

  // Parse Quest schedule text
  const parseQuestSchedule = (text) => {
    const courses = [];
    
    // Match course headers like "CS 245 - Logic & Computation"
    const courseRegex = /([A-Z]{2,5}\s?\d{3}[A-Z]?)\s*-\s*([^\n]+)/g;
    const lines = text.split('\n');
    
    let currentCourse = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check for course header
      const headerMatch = line.match(/^([A-Z]{2,5}\s?\d{3}[A-Z]?)\s*-\s*(.+)$/);
      if (headerMatch) {
        currentCourse = {
          course_code: headerMatch[1].replace(/\s/g, ' '),
          course_name: headerMatch[2].trim(),
          days_of_week: [],
          start_time: null,
          end_time: null
        };
        continue;
      }
      
      // Check for LEC row with time info
      if (currentCourse && line.includes('LEC')) {
        // Look for time pattern in nearby lines
        for (let j = i; j < Math.min(i + 3, lines.length); j++) {
          const timeLine = lines[j];
          // Match patterns like "TTh 11:30AM - 12:50PM"
          const timeMatch = timeLine.match(/([MTWThF]+)\s+(\d{1,2}:\d{2}[AP]M)\s*-\s*(\d{1,2}:\d{2}[AP]M)/);
          if (timeMatch) {
            const daysStr = timeMatch[1];
            const startTime = timeMatch[2];
            const endTime = timeMatch[3];
            
            // Parse days (TTh = Tuesday, Thursday; MWF = Monday, Wednesday, Friday)
            const days = [];
            let k = 0;
            while (k < daysStr.length) {
              if (daysStr.substring(k, k + 2) === 'Th') {
                days.push('Thursday');
                k += 2;
              } else {
                const dayMap = { 'M': 'Monday', 'T': 'Tuesday', 'W': 'Wednesday', 'F': 'Friday' };
                if (dayMap[daysStr[k]]) {
                  days.push(dayMap[daysStr[k]]);
                }
                k++;
              }
            }
            
            // Convert to 24h time for database
            const convertTo24h = (timeStr) => {
              const [time, period] = [timeStr.slice(0, -2), timeStr.slice(-2)];
              let [hours, minutes] = time.split(':').map(Number);
              if (period === 'PM' && hours !== 12) hours += 12;
              if (period === 'AM' && hours === 12) hours = 0;
              return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
            };
            
            currentCourse.days_of_week = days;
            currentCourse.start_time = convertTo24h(startTime);
            currentCourse.end_time = convertTo24h(endTime);
            
            // Only add if we have complete data
            if (currentCourse.days_of_week.length > 0 && currentCourse.start_time) {
              courses.push({ ...currentCourse });
            }
            currentCourse = null;
            break;
          }
        }
      }
    }
    
    return courses;
  };

  const handleParseSchedule = () => {
    setError('');
    const courses = parseQuestSchedule(questText);
    if (courses.length === 0) {
      setError('Could not parse any courses. Make sure you copied your schedule from Quest.');
    } else {
      setParsedCourses(courses);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to continue.');
        setIsLoading(false);
        return;
      }

      // Insert/update user profile
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          program: profile.program,
          student_type: profile.studentType,
          term_number: profile.termNumber
        });

      if (userError) throw userError;

      // Insert courses
      const coursesWithUserId = parsedCourses.map(course => ({
        ...course,
        user_id: user.id
      }));

      const { error: coursesError } = await supabase
        .from('courses')
        .insert(coursesWithUserId);

      if (coursesError) throw coursesError;

      // Success - redirect to dashboard
      navigate('/dashboard');

    } catch (err) {
      console.error('Error saving data:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-cyan-100 px-4 py-8 sm:p-6 md:p-8 lg:p-12">
      <div className="max-w-2xl mx-auto mt-8 sm:mt-12">
        
        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-cyan-500' : 'bg-gray-200'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Profile */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 border border-white/50"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome to SkipCost</h1>
              <p className="text-gray-600 mb-6">Let's set up your profile to calculate your costs.</p>

              {/* Program */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Program</label>
                <select
                  value={profile.program}
                  onChange={(e) => setProfile({ ...profile, program: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white"
                >
                  <option value="">Select your program</option>
                  {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* Student Type */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Student Type</label>
                <select
                  value={profile.studentType}
                  onChange={(e) => setProfile({ ...profile, studentType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white"
                >
                  <option value="">Select student type</option>
                  {STUDENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              {/* Term Number */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Term Number</label>
                <select
                  value={profile.termNumber}
                  onChange={(e) => setProfile({ ...profile, termNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white"
                >
                  <option value="">Select term</option>
                  {TERM_NUMBERS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!profile.program || !profile.studentType || !profile.termNumber}
                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* Step 2: Quest Import */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 border border-white/50"
            >
              <button
                onClick={() => setStep(1)}
                className="text-cyan-600 hover:text-cyan-500 font-medium mb-4 flex items-center gap-1"
              >
                ← Back
              </button>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Import Your Schedule</h1>
              <p className="text-gray-600 mb-6">Copy your schedule from Quest and paste it below.</p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Paste area */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Paste from Quest</label>
                <textarea
                  value={questText}
                  onChange={(e) => setQuestText(e.target.value)}
                  placeholder="Go to Quest → My Class Schedule → Select all and copy → Paste here"
                  rows="8"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none text-sm font-mono"
                />
              </div>

              <button
                onClick={handleParseSchedule}
                disabled={!questText.trim()}
                className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 font-semibold py-3 px-8 rounded-xl transition-all mb-6"
              >
                Parse Schedule
              </button>

              {/* Parsed courses preview */}
              {parsedCourses.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Found {parsedCourses.length} courses:</h3>
                  <div className="space-y-2">
                    {parsedCourses.map((course, idx) => (
                      <div key={idx} className="bg-cyan-50 rounded-xl p-4 border border-cyan-100">
                        <div className="font-semibold text-gray-900">{course.course_code}</div>
                        <div className="text-sm text-gray-600">{course.course_name}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {course.days_of_week.join(', ')} • {course.start_time.slice(0, 5)} - {course.end_time.slice(0, 5)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={parsedCourses.length === 0 || isLoading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all"
              >
                {isLoading ? 'Saving...' : 'Complete Setup'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}