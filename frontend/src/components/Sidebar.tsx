import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  return (
    <nav className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">AgriPlanner</h2>
      <ul className="space-y-2">
        <li><Link to="/" className="block py-2 px-4 hover:bg-gray-700 rounded">Dashboard</Link></li>
        <li><Link to="/crop-planner" className="block py-2 px-4 hover:bg-gray-700 rounded">Crop Planning</Link></li>
        <li><Link to="/crop-plans" className="block py-2 px-4 hover:bg-gray-700 rounded">Crop Plans</Link></li>
        <li><Link to="/soil-analysis" className="block py-2 px-4 hover:bg-gray-700 rounded">Soil Analysis</Link></li>
        <li><Link to="/market-trends" className="block py-2 px-4 hover:bg-gray-700 rounded">Market Trends</Link></li>
        <li><Link to="/weather" className="block py-2 px-4 hover:bg-gray-700 rounded">Weather</Link></li>
        <li><Link to="/stats" className="block py-2 px-4 hover:bg-gray-700 rounded">Agricultural Stats</Link></li>
        <li><Link to="/profile" className="block py-2 px-4 hover:bg-gray-700 rounded">User Profile</Link></li>
        <li><button onClick={onLogout} className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded">Logout</button></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
