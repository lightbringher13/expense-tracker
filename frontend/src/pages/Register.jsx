// src/pages/Register.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export default function Register() {
  const { register } = useAuth()
  const navigate      = useNavigate()

  // Controlled inputs
  const [fullName, setFullName] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  // Validation state
  const [errors, setErrors] = useState({})

  // Re-validate on change
  useEffect(() => {
    const errs = {}
    if (!fullName.trim()) {
      errs.fullName = 'Full name is required.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email.'
    }
    if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.'
    }
    setErrors(errs)
  }, [fullName, email, password])

  const canSubmit =
    fullName &&
    email &&
    password &&
    Object.keys(errors).length === 0

  // Submission handler
  const handleSubmit = async e => {
    e.preventDefault()
    if (!canSubmit) return

    try {
      await register({ fullName, email, password })
      toast.success('Registered! Please sign in.')
      navigate('/login', { replace: true })
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Registration failed.'
      setErrors({ form: msg })
      toast.error(msg)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="register-heading"
      className="space-y-6"
    >
      {/* Page header */}
      <header>
        <h2
          id="register-heading"
          className="text-2xl font-semibold text-center"
        >
          Create Account
        </h2>
      </header>

      {/* Form-level error */}
      {errors.form && (
        <div role="alert" className="text-red-600 text-sm text-center">
          {errors.form}
        </div>
      )}

      {/* Full Name */}
      <section>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium mb-1"
        >
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          aria-invalid={!!errors.fullName}
          aria-describedby={
            errors.fullName ? 'fullName-error' : undefined
          }
          required
          className="w-full p-2 border rounded"
        />
        {errors.fullName && (
          <p
            id="fullName-error"
            className="text-red-600 text-xs mt-1"
          >
            {errors.fullName}
          </p>
        )}
      </section>

      {/* Email */}
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

      {/* Password */}
      <section>
        <label
          htmlFor="password"
          className="block text-sm font-medium mb-1"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
          aria-describedby={
            errors.password ? 'password-error' : undefined
          }
          required
          className="w-full p-2 border rounded"
        />
        {errors.password && (
          <p
            id="password-error"
            className="text-red-600 text-xs mt-1"
          >
            {errors.password}
          </p>
        )}
      </section>

      {/* Actions */}
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
          {canSubmit ? 'Register' : 'Complete all fields'}
        </button>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign In
          </button>
        </div>
      </footer>
    </form>
  )
}