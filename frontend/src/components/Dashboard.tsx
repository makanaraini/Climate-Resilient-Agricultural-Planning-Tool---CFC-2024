import React from 'react';
import WeatherWidget from './WeatherWidget';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Agricultural Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WeatherWidget />
        
        <div className="card">
          <h2 className="text-xl mb-4">Crop Health</h2>
          <p className="text-green-600 font-semibold">Good</p>
        </div>
        
        <div className="card">
          <h2 className="text-xl mb-4">Soil Moisture</h2>
          <p className="text-blue-600 font-semibold">Optimal</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl mb-4">Recent Alerts</h2>
        <ul className="space-y-2">
          <li className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
            Potential pest infestation detected in Sector B
          </li>
          <li className="bg-green-100 border-l-4 border-green-500 p-4">
            Optimal planting conditions for maize in the next week
          </li>
        </ul>
      </div>
      
      <button className="btn-primary mt-8">
        View Detailed Report
      </button>
    </div>
  );
};

export default Dashboard;
