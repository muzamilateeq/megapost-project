import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  addUser,
  clearSession,
  ensureSeedData,
  getSession,
  setSession,
  validateLogin,
} from '../lib/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    ensureSeedData()
    const s = getSession()
    return s?.email ? { email: s.email } : null
  })

  const login = useCallback((email, password) => {
    ensureSeedData()
    if (!validateLogin(email, password)) {
      return { ok: false, error: 'Invalid email or password.' }
    }
    const normalized = email.trim().toLowerCase()
    setSession(normalized)
    setUser({ email: normalized })
    return { ok: true }
  }, [])

  const register = useCallback((email, password) => {
    ensureSeedData()
    const result = addUser(email, password)
    if (!result.ok) return result
    const normalized = email.trim().toLowerCase()
    setSession(normalized)
    setUser({ email: normalized })
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, login, register, logout, isAuthenticated: !!user }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
