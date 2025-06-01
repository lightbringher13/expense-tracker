// src/pages/ConfirmMagicLinkPage.jsx
import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { confirmMagicLink } from "../api/auth";
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ConfirmMagicLink() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAccessToken } = useContext(AuthContext);

  useEffect(() => {
    
    const token = searchParams.get('token');
    console.log("⏳ MagicLinkConfirm running", token);
    if (!token) {
      toast.error('No token provided.');
      navigate('/magic-link', { replace: true });
      return;
    }

    (async () => {
      try {
        // Call backend to confirm magic link
        const accessJwt = await confirmMagicLink(token);
        // Store in context (and localStorage by side‐effect)
        setAccessToken(accessJwt);
        toast.success('Logged in!');
        // Redirect to dashboard (or wherever)
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error(err);
        toast.error('Invalid or expired magic link.');
        navigate('/magic-link', { replace: true });
      }
    })();
  }, [searchParams, navigate, setAccessToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-lg">Verifying magic link...</p>
      </div>
    </div>
  );
}