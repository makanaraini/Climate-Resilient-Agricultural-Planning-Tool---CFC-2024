import React, { useState } from 'react'; // Removed useEffect if not used
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material'; // Import CircularProgress
import { supabase } from '../utils/supabaseClient';
import { analyzeSoil } from '../utils/SoilUtil'; // Ensure this is used
import SoilAnalysisResult from '../components/SoilAnalysisResult'; // Ensure this is imported

function SoilAnalysis() {
  const [soilData, setSoilData] = useState({
    location: '',
    soil_type: '',
    soil_ph: '',
    nutrient_content: '',
    soil_moisture: '',
    soil_temperature: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const analysisResult = await analyzeSoil(soilData.location); // Use the analyzeSoil function
      setResult(analysisResult);
      
      const dataToInsert = {
        location: soilData.location,
        soil_type: soilData.soil_type,
        soil_ph: soilData.soil_ph,
        nutrient_content: soilData.nutrient_content,
        soil_moisture: soilData.soil_moisture,
        soil_temperature: soilData.soil_temperature,
      };

      const { error } = await supabase
        .from('soil_data')
        .insert([dataToInsert]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error during soil analysis:', error);
      setError('Failed to perform soil analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4">Soil Analysis</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Location"
          name="location"
          value={soilData.location}
          onChange={(e) => setSoilData({ ...soilData, location: e.target.value })}
          required
        />
        {/* Add other input fields as needed */}
        <Button type="submit" variant="contained" disabled={loading}>
          Analyze Soil
        </Button>
      </form>
      {loading && <CircularProgress />} {/* Use loading state */}
      {error && <Typography color="error">{error}</Typography>} {/* Use error state */}
      {result && <SoilAnalysisResult result={result} />} {/* Use result state */}
    </Box>
  );
}

export default SoilAnalysis;