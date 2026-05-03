/**
 * Browser-local demo persistence only. Passwords are stored in plain text by
 * design for this sample — do not use this pattern in production.
 */
const USERS_KEY = 'maga_users'
const SESSION_KEY = 'maga_session'
const POSTS_KEY = 'maga_posts'

const DEMO_EMAIL = 'demo@demo.com'
const DEMO_PASSWORD = 'demo123'

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function ensureSeedData() {
  let users = readJson(USERS_KEY, [])
  if (!Array.isArray(users) || users.length === 0) {
    users = [{ email: DEMO_EMAIL, password: DEMO_PASSWORD }]
    writeJson(USERS_KEY, users)
  }
}

export function getUsers() {
  return readJson(USERS_KEY, [])
}

export function addUser(email, password) {
  const users = getUsers()
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: 'An account with this email already exists.' }
  }
  users.push({ email: email.trim().toLowerCase(), password })
  writeJson(USERS_KEY, users)
  return { ok: true }
}

export function validateLogin(email, password) {
  const users = getUsers()
  const found = users.find(
    (u) =>
      u.email.toLowerCase() === email.trim().toLowerCase() &&
      u.password === password,
  )
  return !!found
}

export function getSession() {
  return readJson(SESSION_KEY, null)
}

export function setSession(email) {
  writeJson(SESSION_KEY, { email: email.trim().toLowerCase() })
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function getAllPosts() {
  return readJson(POSTS_KEY, [])
}

export function saveAllPosts(posts) {
  writeJson(POSTS_KEY, posts)
}

export { DEMO_EMAIL, DEMO_PASSWORD }
