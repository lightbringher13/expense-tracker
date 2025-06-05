// src/components/ProtectedRoute.jsx
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { accessToken, isAuthenticated } = useAuth()

  // If there's no valid accessToken (or it’s expired, but we at least check `!isAuthenticated`),
  // redirect to the magic-link page.
  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/magic-link" replace />
  }

  // Otherwise, render the nested routes under this ProtectedRoute.
  // In your App.jsx, you already did:
  //   <Route element={<ProtectedRoute> ...child routes... </ProtectedRoute>} ...>
  //
  // We can now use <Outlet /> so that React Router injects
  // whichever child path is being visited.
  return <Outlet />
}