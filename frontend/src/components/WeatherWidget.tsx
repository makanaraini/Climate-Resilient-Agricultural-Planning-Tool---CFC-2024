import React from 'react';

const WeatherWidget: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Weather Forecast</h2>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold">25°C</p>
          <p className="text-gray-600">Sunny</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Humidity: 60%</p>
          <p className="text-sm text-gray-600">Wind: 5 km/h</p>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">5-Day Forecast</h3>
        <div className="flex justify-between">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
            <div key={day} className="text-center">
              <p className="font-semibold">{day}</p>
              <p className="text-sm">24°C</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
