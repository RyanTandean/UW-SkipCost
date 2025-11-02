import React, { useState } from 'react';

export default function TodayScheduleCard({ lectures = [] }) {
  // Default data if none provided
  const defaultLectures = [
    { 
      id: 1,
      title: 'Linear Algebra',
      time: '8:00 AM',
      cost: 24.50,
      attended: null
    },
    { 
      id: 2,
      title: 'Data Structures',
      time: '10:00 AM',
      cost: 32.75,
      attended: null
    },
    { 
      id: 3,
      title: 'Computer Networks',
      time: '1:00 PM',
      cost: 28.00,
      attended: null
    },
    { 
      id: 4,
      title: 'Software Engineering',
      time: '3:30 PM',
      cost: 31.25,
      attended: null
    }
  ];

  const [lectureData, setLectureData] = useState(
    lectures.length > 0 ? lectures : defaultLectures
  );

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
                <span className="text-lg font-bold text-red-500">${lecture.cost.toFixed(2)}</span>
                <p className="text-xs text-gray-500">Fairshare cost</p>
              </div>
              <div className="text-left ml-3">
                <span className="text-lg font-bold text-red-500">${lecture.cost.toFixed(2)}</span>
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