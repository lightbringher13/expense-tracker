// src/components/NavBar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const linkClasses = ({ isActive }) =>
    isActive
      ? 'px-4 py-2 font-medium text-white bg-blue-600 rounded'
      : 'px-4 py-2 font-medium text-gray-700 hover:text-blue-600';

  return (
    <nav className="bg-white shadow p-4 flex items-center">
      <NavLink to="/dashboard" className={linkClasses}>
        Dashboard
      </NavLink>
      <NavLink to="/expenses" className={linkClasses}>
        Expenses
      </NavLink>
      <NavLink to="/incomes" className={linkClasses}>
        Incomes
      </NavLink>
      <NavLink to="/categories" className={linkClasses}>
        Categories
      </NavLink>
      <NavLink to="/reports" className={linkClasses}>
        Reports
      </NavLink>
      <button
        onClick={handleLogout}
        className="ml-auto px-4 py-2 font-medium text-red-600 hover:text-red-800"
      >
        Logout
      </button>
    </nav>
  );
}