import axios from 'axios';

const API_KEY = process.env.REACT_APP_GEOCODE_API_KEY;
const BASE_URL = 'https://api.opencagedata.com/geocode/v1/json';

const geocodeApiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

export const geocodeLocation = async (location) => {
  try {
    console.log('Geocoding location:', location);
    const response = await geocodeApiClient.get('', {
      params: {
        q: location,
        limit: 1,
      },
    });
    
    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      console.log('Geocoding result:', { lat, lon: lng });
      return { lat, lon: lng };
    } else {
      throw new Error('No results found for the given location');
    }
  } catch (error) {
    console.error('Error geocoding location:', error.response || error);
    throw error;
  }
};

export default geocodeApiClient;
