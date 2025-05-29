// src/pages/ConfirmPage.jsx
import React, { useEffect, useContext, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

export default function ConfirmMagicLink() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.error('Missing token in URL');
      return navigate('/MagicLinkPage');
    }

    async function confirm() {
      try {
        const res = await fetch(`/api/auth/magic-link/confirm?token=${token}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const { token: jwt } = await res.json();
        setAuth({ token: jwt });
        toast.success('Logged in successfully!');
        navigate('/dashboard', { replace: true });
      } catch (err) {
        toast.error('Magic link invalid or expired');
        navigate('/MagicLinkPage');
      } finally {
        setLoading(false);
      }
    }

    confirm();
  }, [token, navigate, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white shadow rounded-lg p-6 text-center">
        {loading ? (
          <p className="text-lg">Logging you in...</p>
        ) : (
          <p className="text-lg">Redirecting...</p>
        )}
      </div>
    </div>
  );
}