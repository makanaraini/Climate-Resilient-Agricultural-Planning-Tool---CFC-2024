import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Check if the environment variables are defined
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be defined in the environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchAllData = async () => {
    return {
        climate_trends: await getClimateTrends(),
        crop_data: await getCropData(),
        farmer_profiles: await getFarmerProfiles(),
        geographical_data: await getGeographicalData(),
        historical_yield_data: await getHistoricalYieldData(),
        irrigation_data: await getIrrigationData(),
        market_data: await getMarketData(),
        pest_and_disease_data: await getPestAndDiseaseData(),
        projected_climate_changes: await getProjectedClimateChanges(),
        soil_data: await getSoilData(),
        sustainability_metrics: await getSustainabilityMetrics(),
        weather_data: await getWeatherData()
    };
};

const getClimateTrends = async () => {
    const { data, error } = await supabase.from('climate_trends').select('*');
    if (error) throw new Error(error.message);
    return data || [];
};

const getCropData = async () => {
    const { data, error } = await supabase.from('crop_data').select('*');
    if (error) throw new Error(error.message);
    return data || [];
};

const getFarmerProfiles = async () => {
    const { data, error } = await supabase.from('farmer_profiles').select('*');
    if (error) throw new Error(error.message);
    return data || [];
};

const getGeographicalData = async () => {
    const { data, error } = await supabase.from('geographical_data').select('*');
    if (error) throw new Error(error.message);
    return data || [];
};

const getHistoricalYieldData = async () => {
    const { data, error } = await supabase.from('historical_yield_data').select('*');
    if (error) throw new Error(error.message);
    return data || [];
};

const getIrrigationData = async () => {
    const { data, error } = await supabase.from('irrigation_data').select('*');
    if (error) throw new Error(error.message);
    return data || [];
};

const getMarketData = async () => {
    const { data, error } = await supabase.from('market_data').select('*');
    if (error) throw new Error(error.message);
    return data || [];
};

const getPestAndDiseaseData = async () => {
    const { data, error } = await supabase.from('pest_and_disease_data').select('*');
    if (error) throw new Error(error.message);
    return data || [];
};

const getProjectedClimateChanges = async () => {
    const { data, error } = await supabase.from('projected_climate_changes').select('*');
    if (error) throw new Error(error.message);
    return data || [];
};

const getSoilData = async () => {
    const { data, error } = await supabase.from('soil_data').select('*');
    if (error) throw new Error(error.message);
    return data || [];
};

const getSustainabilityMetrics = async () => {
    const { data, error } = await supabase.from('sustainability_metrics').select('*');
    if (error) throw new Error(error.message);
    return data || [];
};

const getWeatherData = async () => {
    const { data, error } = await supabase.from('weather_data').select('*');
    if (error) throw new Error(error.message);
    return data || [];
};

// Example usage
if (require.main === module) {
    fetchAllData().then(allData => console.log(allData)).catch(err => console.error(err));
}

// Export the supabase client and fetchAllData
export { supabase };
