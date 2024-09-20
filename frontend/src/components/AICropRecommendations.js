import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CircularProgress, List, ListItem, ListItemText } from '@mui/material';

const AICropRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
