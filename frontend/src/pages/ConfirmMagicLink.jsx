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
        const accessJwt = await confirmMagicLink(token);
        setAccessToken(accessJwt);
        toast.success('Logged in!');
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error("Magic link error:", err);

        // err.message was set to one of:
        //   "INVALID_TOKEN", "TOKEN_EXPIRED", "TOKEN_ALREADY_CONSUMED", or "UNKNOWN_ERROR"
        switch (err.message) {
          case "INVALID_TOKEN":
            toast.error('That link is invalid.');
            navigate('/magic-link', { replace: true });
            break;
          case "TOKEN_EXPIRED":
            toast.error('This magic link has expired. Please request a new one.');
            navigate('/magic-link', { replace: true });
            break;
          case "TOKEN_ALREADY_CONSUMED":
            toast.error('This link has already been used. Please request a new one.');
            navigate("/dashboard", { replace: true });
            break;
          default:
            toast.error('Something went wrong. Try again.');
            navigate('/magic-link', { replace: true });
        }
        
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