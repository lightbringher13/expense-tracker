// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from './layout';

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    // Not logged in → redirect
    return <Navigate to="/login" replace />;
  }

  // Wrap all protected pages in Layout (with NavBar/topbar)
  return <Layout>{children}</Layout>;
}