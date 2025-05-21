// src/pages/IncomeForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams }         from "react-router-dom";
import toast                               from "react-hot-toast";
import { fetchIncomeById, createIncome, updateIncome } from "../api/Incomes";

export default function IncomeForm() {
  // 1) React Router helpers
  const { id } = useParams();             // grab `:id` if editing
  const navigate = useNavigate();         // to redirect on success

  // 2) Form state
  const [form, setForm] = useState({
    amount: "",
    sourceId: "",
    incomeAt: ""
  });
  const [loading, setLoading] = useState(false);

  // 3) If `id` exists, load existing income
  useEffect(() => {
    if (!id) return; // new form
    setLoading(true);
    fetchIncomeById(id)
      .then(res => {
        const inc = res.data;
        // prefill form fields
        setForm({
          amount: inc.amount.amount,
          sourceId: inc.source.id,
          incomeAt: inc.incomeAt.slice(0,16) // "2025-05-22T14:30"
        });
      })
      .catch(() => toast.error("Failed to load income"))
      .finally(() => setLoading(false));
  }, [id]);

  // 4) Handle any input change
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  // 5) Submit handler
  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const action = id
      ? updateIncome(id, form)
      : createIncome(form);

    action
      .then(() => {
        toast.success(id ? "Income updated" : "Income created");
        navigate("/incomes"); // back to list
      })
      .catch(() => toast.error("Save failed"))
      .finally(() => setLoading(false));
  }

  // 6) Render form
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl mb-4">
        {id ? "Edit Income" : "New Income"}
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
            className="w-full p-2 border rounded"
            disabled={loading}
          />
        </div>

        {/* Source (just ID for now) */}
        <div>
          <label className="block mb-1">Source ID</label>
          <input
            type="number"
            name="sourceId"
            value={form.sourceId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            disabled={loading}
          />
        </div>

        {/* Date & time */}
        <div>
          <label className="block mb-1">Date &amp; Time</label>
          <input
            type="datetime-local"
            name="incomeAt"
            value={form.incomeAt}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            disabled={loading}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Saving…" : id ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}