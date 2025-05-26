// src/pages/Login.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  // ① Controlled inputs
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors]     = useState({})

  // ② Validate on each change
  useEffect(() => {
    const errs = {}
    if (!email.trim()) {
      errs.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Invalid email format.'
    }
    if (!password) {
      errs.password = 'Password is required.'
    }
    setErrors(errs)
  }, [email, password])

  const canSubmit = email && password && Object.keys(errors).length === 0

  // ③ Submit handler
  const handleSubmit = async e => {
    e.preventDefault()
    if (!canSubmit) return

    try {
      await login({ email, password })
      toast.success('Welcome back!')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed.'
      setErrors({ form: msg })
      toast.error(msg)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="login-heading"
      className="space-y-6"
    >
      {/* 1) Page header */}
      <header>
        <h2 id="login-heading" className="text-2xl font-semibold text-center">
          Sign In
        </h2>
      </header>

      {/* 2) Form-level error */}
      {errors.form && (
        <div role="alert" className="text-red-600 text-sm text-center">
          {errors.form}
        </div>
      )}

      {/* 3) Email field */}
      <section>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          required
          className="w-full p-2 border rounded"
        />
        {errors.email && (
          <p id="email-error" className="text-red-600 text-xs mt-1">
            {errors.email}
          </p>
        )}
      </section>

      {/* 4) Password field */}
      <section>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          required
          className="w-full p-2 border rounded"
        />
        {errors.password && (
          <p id="password-error" className="text-red-600 text-xs mt-1">
            {errors.password}
          </p>
        )}
      </section>

      {/* 5) Actions footer */}
      <footer className="space-y-4">
        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full p-2 rounded text-white ${
            canSubmit
              ? 'bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {canSubmit ? 'Sign In' : 'Enter credentials'}
        </button>

        <div className="text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </button>
        </div>
      </footer>
    </form>
  )
}