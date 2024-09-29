import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

// Check if the environment variables are defined
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be defined in the environment variables.');
}

console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('Supabase Key:', process.env.REACT_APP_SUPABASE_KEY);

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
