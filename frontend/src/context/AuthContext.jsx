// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { logout as logoutApi, refreshAccessToken } from "../api/auth";
import { useNavigate, useLocation } from 'react-router-dom';
import { isPublicPath } from "../public/PublicRoutes";

// --------------
// 1) Expose a “useAuth” hook so other components can read/write auth state
// --------------
export function useAuth() {
  return useContext(AuthContext);
}

// --------------
// 2) A small helper to decode a JWT’s payload and read the “exp” or “sub” claims
// --------------
function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// --------------
// 3) Create the actual context object (default values don’t truly matter)
// --------------
export const AuthContext = createContext({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  setAccessToken: () => {},
  logout: () => {},
});


// --------------
// 4) AuthProvider: wraps your entire app so you can share “accessToken + user + login/logout”
// --------------
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  //
  // 4.1) Hold the raw accessToken (if any) in state & mirror it in localStorage
  //
  const [accessToken, _setAccessToken] = useState(() => {
    return localStorage.getItem('accessToken');
  });

  //
  // 4.2) Derive a “user” object (e.g. { id, email }) from the accessToken’s claims
  //
  const [user, setUser] = useState(() => {
    if (!accessToken) return null;
    const claims = parseJwt(accessToken);
    return claims ? { id: claims.sub, email: claims.email } : null;
  });

  //
  // 4.3) A boolean that starts as “true” if there is no accessToken, 
  //      so that on the first mount we attempt a single refresh call.
  //
  const [initializing, setInitializing] = useState(() => !accessToken);

  //
  // 4.4) Whenever we set a new accessToken (or clear it), sync to localStorage + update “user”
  //
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

  //
  // 4.5) Logout() should call the API, clear everything, and send the user to /magic-link
  //
  const logout = async () => {
    try {
      await logoutApi(); 
      // This POST /api/auth/logout should clear the server‐side refresh token 
      // and instruct the browser to clear the HttpOnly cookie.
    } catch (err) {
      console.warn("Logout API failed:", err);
    }
    setAccessToken(null);
    navigate("/magic-link", { replace: true });
  };

  //
  // 4.6) On first mount: if we don’t already have an accessToken, attempt exactly one refresh.
  //      Once that attempt finishes (success or fail), setInitializing(false) so the rest of the app renders.
  //
  useEffect(() => {
    if (!accessToken && initializing) {
      (async () => {
        try {
          // POST /api/auth/refresh uses the HttpOnly cookie automatically
          const fresh = await refreshAccessToken(); 
          setAccessToken(fresh);
        } catch {
          // If the cookie was missing/invalid (401), we remain unauthenticated.
        } finally {
          setInitializing(false);
        }
      })();
    }
    // We do not re‐run this effect on every change of accessToken—only on the first mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializing]);

  //
  // 4.7) If we *become* authenticated (accessToken != null) but somehow we are on a public path
  //      (like /magic-link), immediately redirect to /dashboard.
  //
  useEffect(() => {
    if (accessToken && isPublicPath(location.pathname)) {
      navigate("/dashboard", { replace: true });
    }
  }, [accessToken, location.pathname, navigate]);

  //
  // 4.8) While “initializing” is true, we haven’t decided yet if the user is logged in or not.
  //      Return null (or a spinner) so that child routes don’t briefly flash “logged out.”
  //
  if (initializing) {
    return null;
  }

  //
  // 4.9) Provide all values & methods (accessToken, user, isAuthenticated, setAccessToken, logout)
  //
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