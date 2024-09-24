export const generateAIPrompt = (farmData, weatherData, soilData) => {
  return `Based on the following data:
    Farm: ${JSON.stringify(farmData)}
    Weather: ${JSON.stringify(weatherData)}
    Soil: ${JSON.stringify(soilData)}
    Recommend the top 3 crops to grow, including confidence levels and reasons.`;
};
