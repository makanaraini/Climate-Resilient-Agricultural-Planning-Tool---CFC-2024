import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, TextField, Button, Grid, CircularProgress } from '@mui/material';
import { supabase } from '../utils/supabaseClient.js';
import { getSoilMoisture } from '../utils/weatherApiClient.js';
import SoilAnalysisResult from '../components/SoilAnalysisResult.js';

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
        // You should replace these with the actual coordinates of the farm
        const lat = 40.7128;
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
    setSoilData({ ...soilData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const analysisResult = await simulateSoilAnalysis(soilData);
      setResult(analysisResult);
      
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nitrogen (ppm)"
                    name="nitrogen"
                    type="number"
                    value={soilData.nitrogen}
                    onChange={handleInputChange}
                    required
                    sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phosphorus (ppm)"
                    name="phosphorus"
                    type="number"
                    value={soilData.phosphorus}
                    onChange={handleInputChange}
                    required
                    sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Potassium (ppm)"
                    name="potassium"
                    type="number"
                    value={soilData.potassium}
                    onChange={handleInputChange}
                    required
                    sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Organic Matter (%)"
                    name="organicMatter"
                    type="number"
                    value={soilData.organicMatter}
                    onChange={handleInputChange}
                    required
                    sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
                  />
                </Grid>
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
              <Box sx={{ mt: 2, p: 2, backgroundColor: '#ffffff', borderRadius: 1 }}>
                <Typography variant="h6" sx={{ color: '#2e7d32', mb: 1 }}>Estimated Soil Moisture</Typography>
                <Typography>Soil Moisture: {soilMoisture.soilMoisture}</Typography>
                <Typography>Recent Precipitation: {soilMoisture.precipitation.toFixed(2)} mm</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SoilAnalysis;
