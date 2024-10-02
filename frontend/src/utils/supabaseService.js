// supabaseService.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be defined in the environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchWeatherData = async () => {
  const { data, error } = await supabase
    .from('weather_data')
    .select('*');
  if (error) throw new Error(error.message);
  return data;
};

export { supabase };
