import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('Supabase Key:', process.env.REACT_APP_SUPABASE_KEY);

// Now you can run your test script
import './testSupabase.js';
