import axios from 'axios';
import { geocodeLocation } from './geocodeApiClient'; // Import the geocode function

const SOIL_API_URL = process.env.REACT_APP_SOIL_API_URL || 'https://rest.soilgrids.org/query'; // Example soil data API

export const analyzeSoil = async (location) => {
  try {
    const { lat, lon } = await geocodeLocation(location); // Get latitude and longitude
    const soilData = await fetchSoilData(lat, lon);
    return processSoilData(soilData);
  } catch (error) {
    console.error('Error analyzing soil:', error);
    throw error;
  }
};

const fetchSoilData = async (latitude, longitude) => {
  try {
    const response = await axios.get(SOIL_API_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        attributes: 'BLDFIE,CECSOL,CLYPPT,ORCDRC,PHIHOX,SLTPPT,SNDPPT',
        depths: '0-30cm',
        values: 'mean'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching soil data:', error);
    throw error;
  }
};

const processSoilData = (soilData) => {
  // Extract relevant soil properties
  const { properties } = soilData; // Destructure properties from soilData
  
  return {
    bulkDensity: properties.BLDFIE.mean,
    cationExchangeCapacity: properties.CECSOL.mean,
    clayContent: properties.CLYPPT.mean,
    organicCarbonContent: properties.ORCDRC.mean,
    pH: properties.PHIHOX.mean / 10, // Convert to standard pH scale
    siltContent: properties.SLTPPT.mean,
    sandContent: properties.SNDPPT.mean,
    soilTexture: determineSoilTexture(properties.CLYPPT.mean, properties.SLTPPT.mean, properties.SNDPPT.mean),
    soilFertility: determineSoilFertility(properties.ORCDRC.mean, properties.CECSOL.mean)
  };
};

const determineSoilTexture = (clay, silt, sand) => {
  // Implement logic to determine soil texture based on clay, silt, and sand percentages
  // This is a simplified example
  if (clay > 40) return 'Clay';
  if (sand > 60) return 'Sandy';
  if (silt > 60) return 'Silty';
  return 'Loam';
};

const determineSoilFertility = (organicCarbon, cec) => {
  // Implement logic to determine soil fertility based on organic carbon content and CEC
  // This is a simplified example
  if (organicCarbon > 2 && cec > 20) return 'High';
  if (organicCarbon > 1 && cec > 10) return 'Medium';
  return 'Low';
};

export default analyzeSoil;
