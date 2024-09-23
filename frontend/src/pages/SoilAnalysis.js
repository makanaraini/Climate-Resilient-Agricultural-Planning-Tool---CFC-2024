import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, TextField, Button, Grid, CircularProgress } from '@mui/material';
import { supabase } from '../utils/supabaseClient';
import { getSoilMoisture } from '../utils/weatherApiClient';
import SoilAnalysisResult from '../components/SoilAnalysisResult';

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
      // In a real application, you would send this data to a backend for analysis
      // Here, we're simulating an analysis with a simple calculation
      const analysisResult = await simulateSoilAnalysis(soilData);
      setResult(analysisResult);
      
      // Save the soil data and analysis result to the database
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

  // This is a placeholder function. In a real application, this would be a more complex analysis
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
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Soil Analysis
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    Analyze Soil
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            {loading ? (
              <CircularProgress />
            ) : result ? (
              <SoilAnalysisResult result={result} />
            ) : (
              <Typography>Enter soil data and click "Analyze Soil" to see results.</Typography>
            )}
            {error && <Typography color="error">{error}</Typography>}
            {soilMoisture && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6">Estimated Soil Moisture</Typography>
                  <Typography>Soil Moisture: {soilMoisture.soilMoisture}</Typography>
                  <Typography>Recent Precipitation: {soilMoisture.precipitation.toFixed(2)} mm</Typography>
                </Paper>
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SoilAnalysis;
