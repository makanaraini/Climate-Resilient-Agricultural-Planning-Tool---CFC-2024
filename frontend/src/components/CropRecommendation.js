import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';
import { supabase } from '../utils/supabaseClient';

function CropRecommendation() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        // This is a simplified recommendation logic. You might want to implement more sophisticated logic based on weather, soil conditions, etc.
        const { data, error } = await supabase
          .from('crops')
          .select('*')
          .order('water_requirements', { ascending: true })
          .limit(3);

        if (error) throw error;
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError('Failed to fetch crop recommendations');
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  if (loading) return <Typography>Loading recommendations...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h6">Recommended Crops</Typography>
      <List>
        {recommendations.map((crop) => (
          <ListItem key={crop.id}>
            <ListItemText primary={crop.crop_type} secondary={`Water requirement: ${crop.water_requirements} L`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default CropRecommendation;
