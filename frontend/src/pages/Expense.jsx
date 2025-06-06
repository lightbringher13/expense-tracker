// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { fetchExpenses, deleteExpense } from '../api/expense';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  // 1) Local state to hold our expenses list
  const [expenses, setExpenses] = useState([]);

  // 2) Function to load all expenses from backend
  async function loadExpenses() {
    try {
      const { data } = await fetchExpenses();      // a) GET /api/expenses
      setExpenses(data);                            // b) store in state
    } catch (err) {
      console.error(err);
      toast.error('Failed to load expenses');
    }
  }

  // 3) On mount, fetch the data once
  useEffect(() => {
    loadExpenses();
  }, []);

  // 4) Handler to delete an expense and refresh list
  async function handleDelete(id) {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await deleteExpense(id);                      // a) DELETE /api/expenses/:id
      toast.success('Deleted expense');
      loadExpenses();                               // b) reload list
    } catch (err) {
      console.error(err);
      toast.error('Could not delete');
    }
  }

  return (
    <div>
      {/* 5) Header & “New” button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <Link
          to="/expenses/new"
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          + New Expense
        </Link>
      </div>

      {/* 6) Table of expenses */}
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Date</th>
            <th className="p-2">Category</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{new Date(exp.expenseAt).toLocaleDateString()}</td>
              <td className="p-2">{exp.category.name}</td>
              <td className="p-2">${exp.amount.amount.toFixed(2)}</td>
              <td className="p-2 space-x-2">
                <Link
                  to={`/expenses/${exp.id}/edit`}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {expenses.length === 0 && (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No expenses yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}