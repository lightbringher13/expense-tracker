// src/pages/Categories.jsx
import React, { useState, useEffect } from 'react';
import { fetchCategories, deleteCategory } from '../api/categories';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // ① Load categories on mount
  useEffect(() => {
    fetchCategories()
      .then(res => setCategories(res.data))
      .catch(() => toast.error('Failed to load categories'));
  }, []);

  // ② Delete handler
  function handleDelete(id) {
    if (!confirm('Delete this category?')) return;
    deleteCategory(id)
      .then(() => {
        setCategories(categories.filter(c => c.id !== id));
        toast.success('Deleted');
      })
      .catch(() => toast.error('Delete failed'));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Categories</h2>
        <button
          onClick={() => navigate('/categories/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + New Category
        </button>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{cat.name}</td>
              <td className="p-2">{cat.type}</td>
              <td className="p-2 space-x-2 text-center">
                <button
                  onClick={() => navigate(`/categories/${cat.id}/edit`)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}