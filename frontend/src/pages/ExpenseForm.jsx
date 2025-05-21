// src/pages/ExpenseForm.jsx
import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../api/categories';
import {
  createExpense,
  fetchExpenseById,
  updateExpense,
} from '../api/expense';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

export default function ExpenseForm() {
  const navigate = useNavigate();
  const { id } = useParams();       // if editing, URL has :id

  // 1) Form state
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    amount: '',
    categoryId: '',
    description: '',
    expenseAt: '',   // ISO string like "2025-05-22T14:30"
  });

  // 2) Load category options on mount
  useEffect(() => {
    fetchCategories()
      .then(res => setCategories(res.data))
      .catch(() => toast.error('Could not load categories'));
  }, []);

  // 3) If editing, load the existing expense
  useEffect(() => {
    if (id) {
      fetchExpenseById(id)
        .then(res => {
          const e = res.data;
          setForm({
            amount: e.amount.amount,
            categoryId: e.category.id,
            description: e.description || '',
            expenseAt: e.expenseAt.slice(0,16), // drop seconds for <input type="datetime-local">
          });
        })
        .catch(() => toast.error('Could not load expense'));
    }
  }, [id]);

  // 4) Handle form field changes
  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  // 5) Submit handler (create or update)
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (id) {
        await updateExpense(id, form);
        toast.success('Updated!');
      } else {
        await createExpense(form);
        toast.success('Created!');
      }
      navigate('/dashboard');
    } catch {
      toast.error('Save failed');
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow rounded">
      <h1 className="text-xl font-bold mb-4">
        {id ? 'Edit Expense' : 'New Expense'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1">Category</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select…</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Date & Time */}
        <div>
          <label className="block mb-1">Date &amp; Time</label>
          <input
            type="datetime-local"
            name="expenseAt"
            value={form.expenseAt}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {id ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}