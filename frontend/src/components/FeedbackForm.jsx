import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    email: '',
    feedback: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Warn before leaving if form has data
  useEffect(() => {
    const hasFormData = formData.email || formData.feedback;
    
    const handleBeforeUnload = (e) => {
      if (hasFormData && !submitted) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, submitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', formData);
    setSubmitted(true);
    
    setTimeout(() => {
      setFormData({ email: '', feedback: '' });
      setSubmitted(false);
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-cyan-100 px-4 py-8 sm:p-6 md:p-8 lg:p-12">
      <div className="max-w-2xl lg:max-w-3xl mx-auto mt-8 sm:mt-12 lg:mt-16">
        {/* Page header */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-8 lg:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
           How are we doing?
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            Help us make SkipCost better for everyone
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-green-50 border-2 border-green-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
                className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Thank you!</h3>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Your feedback has been submitted successfully.</p>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onSubmit={handleSubmit} 
              className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 lg:p-10 border border-white/50"
            >
              {/* Email */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="mb-4 sm:mb-6"
              >
                <label htmlFor="email" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm sm:text-base transition-shadow"
                  placeholder="your.email@example.com"
                />
              </motion.div>

              {/* Feedback */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mb-6 sm:mb-8"
              >
                <label htmlFor="feedback" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                  Your Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="feedback"
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none text-sm sm:text-base transition-shadow md:min-h-[200px] lg:min-h-[250px]"
                  placeholder="Tell us what you think..."
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-4 sm:py-5 px-8 rounded-xl sm:rounded-2xl shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-400/20 hover:shadow-xl active:scale-[0.98] text-sm sm:text-base lg:text-lg"
                >
                  Submit Feedback
                </button>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}