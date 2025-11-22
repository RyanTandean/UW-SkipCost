import React, { useState, useEffect } from 'react';

export default function TodayScheduleCard({ lectures = [] }) {
  const [lectureData, setLectureData] = useState([]);

  // Update lectureData when lectures prop changes
  useEffect(() => {
    if (lectures.length > 0) {
      setLectureData(lectures);
    }
  }, [lectures]);

  const handleAttendance = (id, attended) => {
    setLectureData(prev =>
      prev.map(lecture =>
        lecture.id === id ? { ...lecture, attended } : lecture
      )
    );
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  // Show empty state if no lectures
  if (lectureData.length === 0) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-md p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Today's Classes</h3>
          <p className="text-sm text-gray-600">{today}</p>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p className="text-4xl mb-2">🎉</p>
          <p>No classes today!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-md p-6">
      <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Today's Classes</h3>
          <p className="text-sm text-gray-600">{today}</p>
      </div>
      <div className="space-y-3">
        {lectureData.map((lecture) => (
          <div 
            key={lecture.id}
            className={`p-4 rounded-2xl transition ${
              lecture.attended === true 
                ? 'bg-green-50 border-2 border-green-200' 
                : lecture.attended === false
                ? 'bg-red-50 border-2 border-red-200'
                : 'bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">{lecture.title}</h4>
                <p className="text-sm text-gray-600">{lecture.time}</p>
              </div>
              <div className="text-left">
                <span className="text-lg font-bold text-red-500">${lecture.fairshareCost?.toFixed(2)}</span>
                <p className="text-xs text-gray-500">Fairshare cost</p>
              </div>
              <div className="text-left ml-3">
                <span className="text-lg font-bold text-red-500">${lecture.individualCost?.toFixed(2)}</span>
                <p className="text-xs text-gray-500">Individual cost</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleAttendance(lecture.id, true)}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition ${
                  lecture.attended === true
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-300'
                }`}
              >
                ✓ Attended
              </button>
              <button
                onClick={() => handleAttendance(lecture.id, false)}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition ${
                  lecture.attended === false
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-red-50 border border-gray-300'
                }`}
              >
                ✗ Skipped
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}