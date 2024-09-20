import React, { useState, useEffect } from 'react';
import axios from './utils/api';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CropPlanner from './components/CropPlanner';
import CropPlans from './components/CropPlans';
import SoilAnalysis from './components/SoilAnalysis';
import MarketTrends from './components/MarketTrends';
import WeatherDetails from './components/WeatherDetails';
import UserProfile from './components/UserProfile';
import AgriculturalStats from './components/AgriculturalStats';
import Auth from './components/Auth';
import NotificationSystem from './components/NotificationSystem';
import { NotificationProvider } from './contexts/NotificationContext';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify the token with your backend
          const response = await axios.get('/api/verify-token', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.isValid) {
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <NotificationProvider>
      <Router>
        {isAuthenticated ? (
          <div className="flex">
            <Sidebar onLogout={handleLogout} />
            <main className="flex-1 bg-gray-100 min-h-screen">
              <NotificationSystem />
              <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route path="/crop-planner" component={CropPlanner} />
                <Route path="/crop-plans" component={CropPlans} />
                <Route path="/soil-analysis" component={SoilAnalysis} />
                <Route path="/market-trends" component={MarketTrends} />
                <Route path="/weather" component={WeatherDetails} />
                <Route path="/profile" component={UserProfile} />
                <Route path="/stats" component={AgriculturalStats} />
                <Redirect to="/" />
              </Switch>
            </main>
          </div>
        ) : (
          <Route path="*">
            <Auth setIsAuthenticated={setIsAuthenticated} />
          </Route>
        )}
      </Router>
    </NotificationProvider>
  );
};

export default App;
