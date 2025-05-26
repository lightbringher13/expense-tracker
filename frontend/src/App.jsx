// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Register     from './pages/Register';
import Login        from './pages/Login';

import Dashboard    from './pages/Dashboard';
import ExpenseForm  from './pages/ExpenseForm';

import Incomes      from './pages/Incomes';
import IncomeForm   from './pages/IncomeForm';

import Categories   from './pages/Categories';
import CategoryForm from './pages/CategoryForm';

import Reports      from './pages/Reports';

import ProtectedRoute from './components/ProtectedRoute';
import Layout         from './Layouts/Layout';
import AuthLayout     from './Layouts/AuthLayout'

export default function App() {
  return (
    <Routes>
      {/* 1) Redirect root → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 2) Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* 3) Protected “shell” */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* a) Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* b) Expense CRUD */}
        <Route path="/expenses/new"        element={<ExpenseForm />} />
        <Route path="/expenses/:id/edit"   element={<ExpenseForm />} />

        {/* c) Income CRUD */}
        <Route path="/incomes"             element={<Incomes />} />
        <Route path="/incomes/new"         element={<IncomeForm />} />
        <Route path="/incomes/:id/edit"    element={<IncomeForm />} />

        {/* d) Category CRUD */}
        <Route path="/categories"          element={<Categories />} />
        <Route path="/categories/new"      element={<CategoryForm />} />
        <Route path="/categories/:id/edit" element={<CategoryForm />} />

        {/* e) Reports */}
        <Route path="/reports"             element={<Reports />} />
      </Route>

      {/* 4) Catch-all for unknown paths */}
      <Route path="*" element={<p className="p-6">Page not found</p>} />
    </Routes>
  );
}