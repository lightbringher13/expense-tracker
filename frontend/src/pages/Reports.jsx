// src/pages/Reports.jsx
import React, { useState, useEffect } from 'react';
import { fetchMonthlyTotals, fetchCategoryTotals } from '../api/reports';
import toast from 'react-hot-toast';

export default function Reports() {
  const [monthly, setMonthly] = useState([]);
  const [byCategory, setByCategory] = useState([]);

  // Load both sets when component mounts
  useEffect(() => {
    fetchMonthlyTotals()
      .then(res => setMonthly(res.data))
      .catch(() => toast.error('Failed to load monthly data'));

    fetchCategoryTotals()
      .then(res => setByCategory(res.data))
      .catch(() => toast.error('Failed to load category data'));
  }, []);

  return (
    <div className="space-y-8">
      {/* Monthly Totals */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Monthly Totals</h2>
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="border-b">
              <th className="p-2">Year</th>
              <th className="p-2">Month</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {monthly.map(({ year, month, total }) => (
              <tr key={`${year}-${month}`} className="hover:bg-gray-50">
                <td className="p-2">{year}</td>
                <td className="p-2">{month}</td>
                <td className="p-2">${total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Category Breakdown */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">By Category</h2>
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="border-b">
              <th className="p-2">Category</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {byCategory.map(({ category, total }) => (
              <tr key={category} className="hover:bg-gray-50">
                <td className="p-2">{category}</td>
                <td className="p-2">${total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}