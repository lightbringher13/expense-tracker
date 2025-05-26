// src/layouts/AuthLayout.jsx
import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header with introduction */}
      <header className="bg-white shadow p-6">
        <h1 className="text-2xl font-bold text-center">Welcome to Expense Tracker</h1>
        <p className="text-center text-gray-600 mt-2">
          Keep track of your expenses, manage budgets, and visualize your spending—all in one place.
        </p>
      </header>

      {/* Main content area centered for auth forms */}
      <main className="flex flex-grow items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Global footer */}
      <footer className="bg-white border-t p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Expense Tracker. All rights reserved.
      </footer>
    </div>
  )
}