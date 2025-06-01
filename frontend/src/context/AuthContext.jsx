// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { logout as logoutApi, refreshAccessToken } from "../api/auth";
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  setAccessToken: () => {},
  logout: () => {},
});

function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [accessToken, _setAccessToken] = useState(() => {
    return localStorage.getItem('accessToken');
  });
  const [user, setUser] = useState(() => {
    if (accessToken) {
      const claims = parseJwt(accessToken);
      return claims ? { id: claims.sub, email: claims.email } : null;
    }
    return null;
  });

  // Wrap setting token so that we also store user info and persist to localStorage
  const setAccessToken = (token) => {
    if (token) {
      localStorage.setItem('accessToken', token);
      const claims = parseJwt(token);
      setUser(claims ? { id: claims.sub, email: claims.email } : null);
      _setAccessToken(token);
    } else {
      localStorage.removeItem('accessToken');
      setUser(null);
      _setAccessToken(null);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.warn('Logout API failed:', err);
    }
    setAccessToken(null);
    navigate('/login', { replace: true });
  };

  // Optional: if you want to auto‐refresh accessToken on page load
  useEffect(() => {
    // If there is no token in memory but maybe a refresh cookie exists, try to get a new accessToken
    if (!accessToken) {
      (async () => {
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            setAccessToken(newToken);
          }
        } catch {
          // No valid refresh token / unauthorized; stay logged out
        }
      })();
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        isAuthenticated: Boolean(accessToken),
        setAccessToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}