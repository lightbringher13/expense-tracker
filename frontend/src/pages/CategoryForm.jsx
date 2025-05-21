// src/pages/CategoryForm.jsx
import React, { useState, useEffect } from 'react';
import { createCategory, fetchCategoryById, updateCategory } from '../api/categories';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CategoryForm() {
  const { id } = useParams();            // if editing, :id is present
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  // ① Form state
  const [name, setName] = useState('');
  const [type, setType] = useState('EXPENSE'); // default

  // ② If edit, load existing data
  useEffect(() => {
    if (!isEdit) return;
    fetchCategoryById(id)
      .then(res => {
        setName(res.data.name);
        setType(res.data.type);
      })
      .catch(() => toast.error('Failed to load category'));
  }, [id, isEdit]);

  // ③ Handle submit
  function handleSubmit(e) {
    e.preventDefault();
    const payload = { name, type };
    const action = isEdit
      ? updateCategory(id, payload)
      : createCategory(payload);

    action
      .then(() => {
        toast.success(isEdit ? 'Updated!' : 'Created!');
        navigate('/categories');
      })
      .catch(() => toast.error('Save failed'));
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? 'Edit Category' : 'New Category'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {isEdit ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}