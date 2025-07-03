import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    console.log('AuthContext login called with userData:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    console.log('AuthContext logout called');
    setUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    console.log('AuthContext useEffect validating token for user:', user);
    // Validate token or refresh session here
    const validateToken = async () => {
      if (!user) {
        console.log('No user found, skipping token validation');
        return;
      }
      try {
        // Example: decode token and check expiry (assuming JWT)
        const token = user.token;
        console.log('Validating token:', token);
        if (!token) {
          console.log('No token found, logging out');
          logout();
          return;
        }
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp;
        const now = Math.floor(Date.now() / 1000);
        console.log(`Token expiry: ${exp}, current time: ${now}`);
        if (exp < now) {
          console.log('Token expired, logging out');
          logout();
        }
      } catch (error) {
        console.error('Error validating token:', error);
        logout();
      }
    };
    validateToken();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
