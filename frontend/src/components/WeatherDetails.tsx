import React from 'react';

interface DailyForecast {
  day: string;
  temperature: number;
  description: string;
  icon: string;
}

const WeatherDetails: React.FC = () => {
  const currentWeather = {
    temperature: 25,
    description: 'Partly cloudy',
    humidity: 60,
    windSpeed: 10,
    icon: '🌤️',
  };

  const weeklyForecast: DailyForecast[] = [
    { day: 'Mon', temperature: 26, description: 'Sunny', icon: '☀️' },
    { day: 'Tue', temperature: 28, description: 'Clear', icon: '☀️' },
    { day: 'Wed', temperature: 27, description: 'Partly cloudy', icon: '🌤️' },
    { day: 'Thu', temperature: 25, description: 'Cloudy', icon: '☁️' },
    { day: 'Fri', temperature: 23, description: 'Light rain', icon: '🌦️' },
    { day: 'Sat', temperature: 22, description: 'Showers', icon: '🌧️' },
    { day: 'Sun', temperature: 24, description: 'Partly cloudy', icon: '🌤️' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Weather Details</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Weather</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-4xl font-bold">{currentWeather.temperature}°C</p>
            <p className="text-gray-600">{currentWeather.description}</p>
          </div>
          <div className="text-6xl">{currentWeather.icon}</div>
        </div>
        <div className="mt-4">
          <p>Humidity: {currentWeather.humidity}%</p>
          <p>Wind Speed: {currentWeather.windSpeed} km/h</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">7-Day Forecast</h2>
        <div className="grid grid-cols-7 gap-4">
          {weeklyForecast.map((day) => (
            <div key={day.day} className="text-center">
              <p className="font-semibold">{day.day}</p>
              <p className="text-2xl my-2">{day.icon}</p>
              <p>{day.temperature}°C</p>
              <p className="text-sm text-gray-600">{day.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Agricultural Weather Insights</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Ideal conditions for crop growth expected in the next 3 days.</li>
          <li>Light rain forecast for Friday may benefit recently planted crops.</li>
          <li>Consider irrigation planning for the weekend due to expected dry conditions.</li>
          <li>Monitor soil moisture levels closely next week as temperatures rise.</li>
        </ul>
      </div>
    </div>
  );
};

export default WeatherDetails;
