import { GoTrueClient } from '@supabase/gotrue-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const goTrueClient = new GoTrueClient({
    url: `${supabaseUrl}/auth/v1`,
    audience: '',
    setCookie: true,
});

// Export the singleton instance
export const getGoTrueClient = () => goTrueClient;

// Function to sign in with email and password
export const signInWithPassword = async ({ email, password }) => {
    return await goTrueClient.signIn({ email, password });
};

// Function to sign out
export const signOut = async () => {
    return await goTrueClient.signOut();
};

// Function to get the current session
export const getSession = async () => {
    return await goTrueClient.getSession();
};
