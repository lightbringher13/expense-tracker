// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { logout as logoutApi, refreshAccessToken } from "../api/auth";
import { useNavigate } from 'react-router-dom';
import { isPublicPath } from "../public/PublicRoutes";

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

  useEffect(() => {
    // On first render, if we don’t already have an accessToken but the browser
    // still has a valid refresh‐token cookie, swap it for a fresh accessToken:
    if (!accessToken) {
      (async () => {
        try {
          const newToken = await refreshAccessToken(); // calls POST /api/auth/refresh
          if (newToken) {
            setAccessToken(newToken);
          }
        } catch {
          // no valid refresh cookie → stay unauthenticated
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