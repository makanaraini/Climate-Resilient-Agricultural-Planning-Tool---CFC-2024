import React, { createContext, useState, useContext, useEffect } from 'react';
import { getGoTrueClient } from '../utils/auth'; // Ensure this matches the export

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabaseAuth = getGoTrueClient();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabaseAuth.getSession();
      if (error) console.error('Error fetching session:', error);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabaseAuth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      if (authListener && authListener.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, [supabaseAuth]);

  const login = async (email, password) => {
    const { data, error } = await supabaseAuth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  };

  const logout = async () => {
    const { error } = await supabaseAuth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates) => {
    const { data, error } = await supabaseAuth.updateUser(updates);
    if (error) throw error;
    setUser(data.user);
    return data.user;
  };

  const value = {
    user,
    login,
    logout,
    updateProfile,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
