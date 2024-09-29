import { useEffect } from 'react';
import { useCropRecommendations } from '../contexts/CropRecommendationsContext.js';
import { getAICropRecommendations } from '../services/aiRecommendationService.js';
import { getWeatherForecast } from '../utils/weatherUtil.js';
import analyzeSoil from '../utils/SoilUtil.js';
import { findSuitableCrops } from '../utils/cropDatabaseUtil.js';
import { generateAIPrompt } from '../utils/promptGeneratorUtil.js';

export const useAICropRecommendations = (farmData) => {
  const { 
    recommendations, 
    setRecommendations, 
    loading, 
    setLoading, 
    error, 
    setError 
  } = useCropRecommendations();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const weatherData = await getWeatherForecast(farmData.latitude, farmData.longitude);
        const soilData = await analyzeSoil(farmData.latitude, farmData.longitude);
        const suitableCrops = findSuitableCrops({ 
          temp: weatherData.avgTemp, 
          rainfall: weatherData.totalRainfall,
          soilTexture: soilData.soilTexture,
          soilFertility: soilData.soilFertility
        });
        const prompt = generateAIPrompt(farmData, weatherData, soilData);
        
        const aiRecommendations = await getAICropRecommendations(prompt);
        setRecommendations(aiRecommendations);
      } catch (err) {
        setError('Failed to fetch recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (farmData) {
      fetchRecommendations();
    }
  }, [farmData, setRecommendations, setLoading, setError]);

  return { recommendations, loading, error };
};
