import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.id, role: decoded.role, name: decoded.name, email: decoded.email });
        console.log(user)
      } catch (error) {
        console.error('Token decode failed', error);
        setUser(null);
      }
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
   
  }, [user]);

  const login = (token) => {
  
    try {
      const decoded = jwtDecode(token);
      localStorage.setItem('token', token);
      setUser({ id: decoded.id, role: decoded.role, name: decoded.name, email: decoded.email });
    } catch (error) {
      console.error('Token decode failed', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  console.log('USERRR:', user);

  if (loading) {
    return <div>Loading...</div>; // Pode personalizar o indicador de carregamento
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
