import React, {
  createContext,  // ① to make a new Context object
  useState,       // ② to hold token in component state
  useEffect       // ③ to react to state changes (optional profile fetch)
} from 'react';
import { useNavigate } from 'react-router-dom';  
import * as authApi from '../api/auth';        // ④ our auth service functions
import { useContext } from "react";

// ⑤ Define the shape of our context
export const AuthContext = createContext({
  token: null,        // current JWT (or null if not logged in)
  login: () => {},    // function to perform login
  register: () => {}, // function to perform registration
  logout: () => {}    // function to clear auth
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // ⑥ token state, initialized from localStorage so it survives reloads
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const navigate          = useNavigate(); 

  // ⑦ Optional: when token changes, you could fetch user profile here
  useEffect(() => {
    if (!token) return;
    // e.g. authApi.getProfile().then(...).catch(logout)
  }, [token]);

  // ⑧ login: call API, store token, update state, redirect
  const login = async ({ email, password }) => {
    const { data } = await authApi.login({ email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    navigate('/dashboard');
  };

  // ⑨ register: call API then send user to login page
  const register = async ({ fullName, email, password }) => {
    await authApi.register({ fullName, email, password });
    navigate('/login');
  };

  // ⑩ logout: clear token and redirect
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  // ⑪ Expose `token`, and the three functions to all children
  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}