import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const weatherApiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric',
  },
});

export const getWeatherForecast = async (lat, lon) => {
  try {
    console.log('Fetching weather data for:', { lat, lon });
    const response = await weatherApiClient.get('/forecast', {
      params: {
        lat,
        lon,
      },
    });
    console.log('Weather data received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather forecast:', error.response || error);
    throw error;
  }
};

export const getSoilMoisture = async (lat, lon) => {
  try {
    // OpenWeatherMap doesn't provide soil moisture directly.
    // We'll estimate it based on recent precipitation.
    const response = await weatherApiClient.get('/forecast', {
      params: {
        lat,
        lon,
      },
    });
    
    // Calculate average precipitation for the next few days
    const precipitation = response.data.list.slice(0, 8).reduce((sum, item) => {
      return sum + (item.rain ? item.rain['3h'] : 0);
    }, 0) / 8;

    // Very basic estimation
    const estimatedSoilMoisture = precipitation > 5 ? 'High' : precipitation > 1 ? 'Medium' : 'Low';

    return {
      soilMoisture: estimatedSoilMoisture,
      precipitation: precipitation
    };
  } catch (error) {
    console.error('Error estimating soil moisture:', error);
    throw error;
  }
};

export default weatherApiClient;
