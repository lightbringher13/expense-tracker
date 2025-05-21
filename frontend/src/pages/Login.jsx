import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);

  // ① Form fields
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  // ② Validation & submission control
  const [errors, setErrors]     = useState({});
  const [canSubmit, setCanSubmit] = useState(false);

  // ③ Validate on every change
  useEffect(() => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Invalid email format.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    }
    setErrors(errs);
    setCanSubmit(Object.keys(errs).length === 0);
  }, [email, password]);

  // ④ Handle submission
  const handleSubmit = async e => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      await login({ email, password });
      // on success, AuthContext redirects to /dashboard
      toast.success('Welcome back!');           // success toast
    } catch (err) {
      // backend error (wrong creds)
      setErrors({ form: err.response?.data || 'Login failed.' });
      toast.error(msg);                         // error toast
    }
  };

  return (
    <div className="mx-auto mt-6 p-4 sm:p-6 bg-white rounded shadow max-w-full sm:max-w-md md:max w-lg lg:max-w-xl">
      <h1 className="text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6">Login</h1>
      {/* ⑤ Form-level error */}
      {errors.form && (
        <p className="text-red-600 mb-2">{errors.form}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            <p className="text-red-600 text-sm mt-1">
              {errors.email}
            </p>
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
            <p className="text-red-600 text-sm mt-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full p-2 rounded text-white ${
            canSubmit
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Login
        </button>
      </form>
    </div>
  );
}