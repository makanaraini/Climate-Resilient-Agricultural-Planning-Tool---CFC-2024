// supabaseService.js
import { supabase } from './supabaseClient'; // Import supabase from supabaseClient.js

export const fetchWeatherData = async () => {
  const { data, error } = await supabase
    .from('weather_data')
    .select('*');
  if (error) throw new Error(error.message);
  return data;
};
