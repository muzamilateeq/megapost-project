import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RouteFallback } from './components/RouteFallback'
import { AllPosts } from './pages/AllPosts'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import './App.css'

const AddPost = lazy(() =>
  import('./pages/AddPost').then((m) => ({ default: m.AddPost })),
)
const EditPost = lazy(() =>
  import('./pages/EditPost').then((m) => ({ default: m.EditPost })),
)

function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="add-post" element={<AddPost />} />
          <Route path="all-posts" element={<AllPosts />} />
          <Route path="edit-post/:id" element={<EditPost />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
