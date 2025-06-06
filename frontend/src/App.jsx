// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MagicLinkPage     from './pages/MagicLinkPage';
import ConfirmMagicLink        from './pages/ConfirmMagicLink';

import Dashboard    from './pages/Dashboard';

import Expense      from './pages/Expense';
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
      <Route path="/" element={<Navigate to="/magic-link" replace />} />

      {/* 2) Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/magic-link"    element={<MagicLinkPage />} />
        <Route path="/magic-link/confirm" element={<ConfirmMagicLink />} />
      </Route>

      {/* 3) All “logged-in” routes go under ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        {/* 3a) Wrap them in Layout (Navbar + content area) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Expense CRUD */}
          <Route path="/expenses"           element={<Expense />} />
          <Route path="/expenses/new"       element={<ExpenseForm  />} />
          <Route path="/expenses/:id/edit" element={<ExpenseForm />} />

          {/* Income CRUD */}
          <Route path="/incomes"           element={<Incomes />} />
          <Route path="/incomes/new"       element={<IncomeForm />} />
          <Route path="/incomes/:id/edit"  element={<IncomeForm />} />

          {/* Category CRUD */}
          <Route path="/categories"        element={<Categories />} />
          <Route path="/categories/new"    element={<CategoryForm />} />
          <Route path="/categories/:id/edit" element={<CategoryForm />} />

          {/* Reports */}
          <Route path="/reports"           element={<Reports />} />
        </Route>
      </Route>

      {/* 4) Catch‐all 404 */}
      <Route path="*" element={<p className="p-6">Page not found</p>} />
    </Routes>
  );
}