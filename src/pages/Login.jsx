import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DEMO_EMAIL, DEMO_PASSWORD } from '../lib/storage'

export function Login() {
  const { login, isAuthenticated } = useAuth()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const result = login(email, password)
    if (!result.ok) setError(result.error)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__subtitle">Sign in to manage your posts.</p>
        <form className="form" onSubmit={handleSubmit}>
          {error ? (
            <p className="form__error" role="alert">
              {error}
            </p>
          ) : null}
          <label className="form__label">
            Email
            <input
              className="form__input"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="form__label">
            Password
            <input
              className="form__input"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn btn--primary btn--block">
            Log in
          </button>
        </form>
        <p className="auth-card__hint">
          Demo account: <code>{DEMO_EMAIL}</code> / <code>{DEMO_PASSWORD}</code>
        </p>
        <p className="auth-card__footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
