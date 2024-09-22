import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CircularProgress, List, ListItem, ListItemText } from '@mui/material';

const AICropRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tailwind classes for styling
  const containerClasses = "bg-white shadow-lg rounded-lg p-6 mb-8";
  const titleClasses = "text-2xl font-bold text-gray-800 mb-4";
  const loadingClasses = "flex justify-center items-center h-40";
  const errorClasses = "text-red-500 text-center";
  const listClasses = "divide-y divide-gray-200";
  const listItemClasses = "py-4";
  const cropNameClasses = "text-lg font-semibold text-indigo-600";
  const confidenceClasses = "text-sm text-gray-600";
  const reasonClasses = "mt-1 text-gray-500";

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store the JWT token in localStorage
        const response = await axios.get('http://localhost:5000/api/ai-recommendations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecommendations(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch recommendations. Please try again later.');
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          AI Crop Recommendations
        </Typography>
        <List>
          {recommendations.map((recommendation, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={recommendation.crop}
                secondary={`Confidence: ${recommendation.confidence}%, Reason: ${recommendation.reason}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default AICropRecommendations;
