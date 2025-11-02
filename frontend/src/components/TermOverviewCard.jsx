import React from 'react';

export default function TermOverviewCard({ 
  moneyLost = 234.50, 
  attendanceRate = 87.5,
  totalClasses = 48,
  classesAttended = 42 
}) {
  const attendanceColor = attendanceRate >= 80 ? 'text-green-500' : attendanceRate >= 60 ? 'text-yellow-500' : 'text-red-500';
  const attendanceBgColor = attendanceRate >= 80 ? 'bg-green-50' : attendanceRate >= 60 ? 'bg-yellow-50' : 'bg-red-50';

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Term Overview</h3>
        <svg 
          className="w-5 h-5 text-gray-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Money Lost */}
        <div className="bg-red-50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <svg 
              className="w-5 h-5 text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">Money Lost</span>
          </div>
          <p className="text-3xl font-bold text-red-600">${moneyLost.toFixed(2)}</p>
          <p className="text-xs text-gray-600 mt-1">from skipped classes</p>
        </div>

        {/* Attendance Rate */}
        <div className={`${attendanceBgColor} rounded-2xl p-5`}>
          <div className="flex items-center gap-2 mb-2">
            <svg 
              className={`w-5 h-5 ${attendanceColor}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">Attendance Rate</span>
          </div>
          <p className={`text-3xl font-bold ${attendanceColor}`}>{attendanceRate}%</p>
          <p className="text-xs text-gray-600 mt-1">{classesAttended}/{totalClasses} classes attended</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span>Term Progress</span>
          <span>{Math.round((classesAttended / totalClasses) * 100)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(classesAttended / totalClasses) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}