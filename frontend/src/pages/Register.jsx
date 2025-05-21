import React, { useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';             // ① import toast
import Spinner from '../components/Spinner';     // ② import Spinner
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const { register } = useContext(AuthContext);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  // Validation & submission state
  const [errors, setErrors]     = useState({});
  const [canSubmit, setCanSubmit] = useState(false);

  // ① Validate on every change
  useEffect(() => {
    const errs = {};
    if (!fullName.trim()) {
      errs.fullName = 'Full name is required.';
    }
    // simple email regex
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email.';
    }
    if (password.length < 6) {
      errs.password = 'Password must be ≥ 6 characters.';
    }
    setErrors(errs);
    // can submit only if no errors
    setCanSubmit(Object.keys(errs).length === 0);
  }, [fullName, email, password]);

  // ② Handle form submission
  const handleSubmit = async e => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      await register({ fullName, email, password });
      toast.success('Registered! Please log in.');  // ④ success toast
    } catch (err) {
      // backend error could be an email-taken message
      setErrors({ form: err.response?.data || 'Registration failed.' });
      toast.error(msg);                             // ⑤ error toast
    }
  };

  return (
    <div className="mx-auto mt-6 p-4 sm:p-6 bg-white rounded shadow max-w-full sm:max-w-md md:max w-lg lg:max-w-xl">
      <h1 className="text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6">Register</h1>
      {/* ③ Show form-level error */}
      {errors.form && <p className="text-red-600 mb-2">{errors.form}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {/* ④ Field-level error */}
          {errors.fullName && (
            <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full p-2 rounded text-white ${
            canSubmit ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Register
        </button>
      </form>
    </div>
  );
}