import React from 'react';

export default function PlaceholderCard({ title = "AI Insights", height = "h-50" }) {
  return (
    <div className={`bg-gradient-to-br from-purple-50 to-blue-50 backdrop-blur-sm rounded-3xl shadow-md p-6 ${height} flex flex-col items-center justify-center border-2 border-dashed border-purple-200`}>
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg 
            className="w-8 h-8 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">Smart patterns from your data</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Skip frequency analysis</p>
          <p>• Cost breakdown insights</p>
          <p>• Attendance trend predictions</p>
        </div>
      </div>
    </div>
  );
}