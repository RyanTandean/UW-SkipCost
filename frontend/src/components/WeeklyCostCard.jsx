import React from 'react';

export default function WeeklyCostCard({ weekData = [] }) {
  // Default data if none provided
  const defaultWeekData = [
    { day: 'Mon', date: '22', cost: 45.50 },
    { day: 'Tue', date: '23', cost: 32.75 },
    { day: 'Wed', date: '24', cost: 65.00 },
    { day: 'Thu', date: '25', cost: 22.50 },
    { day: 'Fri', date: '26', cost: 48.25 },
    { day: 'Sat', date: '27', cost: 0 },
    { day: 'Sun', date: '28', cost: 0 }
  ];

  const data = weekData.length > 0 ? weekData : defaultWeekData;
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-md p-6">
      <h3 className="text-sm font-semibold text-gray-600 mb-4">{currentMonth}</h3>
      
      <div className="grid grid-cols-7 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">{item.day}</span>
            <span className="text-sm font-semibold text-gray-700 mb-2">{item.date}</span>
            <div className={`w-full py-3 rounded-xl text-center ${
              item.cost > 0 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-100 text-gray-400'
            }`}>
              <span className="text-sm font-bold">
                ${item.cost.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}