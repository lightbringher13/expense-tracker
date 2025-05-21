// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 1) Always show the nav */}
      <NavBar />

      {/* 2) Main content area */}
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  );
}