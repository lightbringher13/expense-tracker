import React, { useState, useEffect } from 'react';
import { fetchExpenses, deleteExpense } from '../api/expense';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [health, setHealth] = useState(null); // ### NEW: State for health check

  // ### NEW: Function to call the health endpoint
  async function checkHealth() {
    try {
      const res = await fetch('/api/v1/health');
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      setHealth(`Status: ${data.status}`);
    } catch (err) {
      setHealth('Error: ' + err.message);
    }
  }

  async function loadExpenses() {
    try {
      const { data } = await fetchExpenses();
      setExpenses(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load expenses');
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await deleteExpense(id);
      toast.success('Deleted expense');
      loadExpenses();
    } catch (err) {
      console.error(err);
      toast.error('Could not delete');
    }
  }

  return (
    <div>
      {/* ### NEW: Health check button and display ### */}
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <h2 className="font-bold mb-2">Connection Test</h2>
        <p className="text-sm mb-2">
          Click to verify connection to the backend. You should see "Status: ok".
        </p>
        <button
          onClick={checkHealth}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm"
        >
          Check Backend Health
        </button>
        {health && (
          <pre className="mt-2 p-2 bg-gray-100 rounded text-sm">
            {health}
          </pre>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <Link
          to="/expenses/new"
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          + New Expense
        </Link>
      </div>

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
