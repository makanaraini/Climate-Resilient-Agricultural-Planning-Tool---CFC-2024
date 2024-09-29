import React from 'react';
import { createContext, useState, useContext } from 'react.js';

const CropRecommendationsContext = createContext();

export const useCropRecommendations = () => useContext(CropRecommendationsContext);

export const CropRecommendationsProvider = ({ children }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const value = {
    recommendations,
    setRecommendations,
    loading,
    setLoading,
    error,
    setError,
  };

  return (
    <CropRecommendationsContext.Provider value={value}>
      {children}
    </CropRecommendationsContext.Provider>
  );
};

// Add this line at the end of the file
export default CropRecommendationsProvider;
