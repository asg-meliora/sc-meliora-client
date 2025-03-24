import React, { createContext, useState, useEffect } from 'react';

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [token, setToken_] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setToken_(token);
  }, []);

  const setToken = (token) => {
    setToken_(token);
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  };

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};