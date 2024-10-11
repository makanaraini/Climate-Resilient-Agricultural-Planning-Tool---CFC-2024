import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, TextField, Button, Grid, CircularProgress } from '@mui/material';
import { supabase } from '../utils/supabaseClient';
import { getSoilMoisture } from '../utils/weatherApiClient';
import SoilAnalysisResult from '../components/SoilAnalysisResult'; // Import the result component

function SoilAnalysis() {
  const [soilData, setSoilData] = useState({
    pH: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organicMatter: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [soilMoisture, setSoilMoisture] = useState(null);

  useEffect(() => {
    async function fetchSoilMoisture() {
      try {
        const lat = 40.7128; // Replace with actual coordinates
        const lon = -74.0060;
        const data = await getSoilMoisture(lat, lon);
        setSoilMoisture(data);
      } catch (error) {
        console.error('Error fetching soil moisture:', error);
      }
    }

    fetchSoilMoisture();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Validate input
    if (name === 'pH' && (value < 0 || value > 14)) {
      setError('pH must be between 0 and 14.');
      return;
    }
    // Add similar checks for other inputs
    setSoilData({ ...soilData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const analysisResult = await simulateSoilAnalysis(soilData);
      setResult(analysisResult);
      
      // Clear form after submission
      setSoilData({
        pH: '',
        nitrogen: '',
        phosphorus: '',
        potassium: '',
        organicMatter: ''
      });

      const { error } = await supabase
        .from('soil_analyses')
        .insert([{ ...soilData, result: analysisResult }]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error during soil analysis:', error);
      setError('Failed to perform soil analysis');
    } finally {
      setLoading(false);
    }
  };

  const simulateSoilAnalysis = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const pH = parseFloat(data.pH);
    const nutrientLevel = (parseFloat(data.nitrogen) + parseFloat(data.phosphorus) + parseFloat(data.potassium)) / 3;
    
    let result = '';
    if (pH < 6.0) result += "Acidic soil. Consider liming. ";
    if (pH > 7.5) result += "Alkaline soil. Consider adding sulfur. ";
    if (nutrientLevel < 50) result += "Low nutrient levels. Consider fertilizing. ";
    if (soilMoisture && soilMoisture.topSoilMoisture < 0.2) result += "Soil is dry. Consider irrigation. ";
    if (result === '') result = "Soil conditions are generally good.";
    
    return result.trim();
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f0f8ff' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold', mb: 3 }}>
        Soil Analysis
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* Input fields for soil data */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="pH"
                    name="pH"
                    type="number"
                    value={soilData.pH}
                    onChange={handleInputChange}
                    required
                    sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
                  />
                </Grid>
                {/* Other input fields for nitrogen, phosphorus, potassium, organic matter */}
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={loading}
                    sx={{ 
                      backgroundColor: '#2e7d32', 
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#1b5e20',
                      },
                    }}
                  >
                    Analyze Soil
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 3 }}>
            {loading ? (
              <CircularProgress sx={{ color: '#2e7d32' }} />
            ) : result ? (
              <SoilAnalysisResult result={result} />
            ) : (
              <Typography sx={{ color: '#2e7d32' }}>Enter soil data and click "Analyze Soil" to see results.</Typography>
            )}
            {error && <Typography color="error">{error}</Typography>}
            {soilMoisture && (
              <div>
                <Typography>Soil Moisture: {soilMoisture.value}</Typography> // Access specific property
                <Typography>Precipitation: {soilMoisture.precipitation}</Typography> // Access specific property
              </div>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SoilAnalysis;