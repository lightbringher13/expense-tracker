// src/pages/MagicLinkPage.jsx
import React, { useState } from 'react';
import { sendMagicLink } from "../api/auth";
import toast from 'react-hot-toast';

export default function MagicLinkPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await sendMagicLink({ email });
      setStatus('sent');
      toast.success('Magic link sent! Check your inbox.');
    } catch (err) {
      console.error(err);
      setStatus(null);
      toast.error('Failed to send magic link. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Log In with Magic Link</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Email address</span>
            <input
              type="email"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
        {status === 'sent' && (
          <p className="mt-4 text-green-600">Check your email for the login link!</p>
        )}
      </div>
    </div>
  );
}