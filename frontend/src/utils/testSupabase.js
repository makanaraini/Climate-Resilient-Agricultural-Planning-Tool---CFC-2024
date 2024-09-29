import { supabase } from './supabaseClient.js'; // Use import instead of require

const testSignIn = async () => {
  const email = 'danielraini871@gmail.com'; // Replace with a valid email
  const password = 'EEE2062rm'; // Replace with the correct password

  const { user, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    console.error('Sign-in error:', error);
  } else {
    console.log('User signed in:', user);
  }
};

testSignIn();