// src/pages/IncomeForm.jsx
import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../api/categories';   // assume you categorize incomes too
import {
  createIncome,
  fetchIncomeById,
  updateIncome,
} from '../api/Incomes';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

export default function IncomeForm() {
  const navigate = useNavigate();
  const { id } = useParams();  // if editing

  // 1) State
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    amount: '',
    categoryId: '',
    description: '',
    incomeAt: '',
  });

  // 2) Load categories on mount
  useEffect(() => {
    fetchCategories()
      .then(res => setCategories(res.data))
      .catch(() => toast.error('Failed to load categories'));
  }, []);

  // 3) If editing, load existing income
  useEffect(() => {
    if (id) {
      fetchIncomeById(id)
        .then(res => {
          const inc = res.data;
          setForm({
            amount: inc.amount.amount,
            categoryId: inc.category.id,
            description: inc.description || '',
            incomeAt: inc.incomeAt.slice(0,16),
          });
        })
        .catch(() => toast.error('Failed to load income'));
    }
  }, [id]);

  // 4) Handle field updates
  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  // 5) Submit create/update
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (id) {
        await updateIncome(id, form);
        toast.success('Income updated');
      } else {
        await createIncome(form);
        toast.success('Income added');
      }
      navigate('/incomes');
    } catch {
      toast.error('Save failed');
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow rounded">
      <h1 className="text-xl font-bold mb-4">
        {id ? 'Edit Income' : 'New Income'}
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
            name="incomeAt"
            value={form.incomeAt}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {id ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}