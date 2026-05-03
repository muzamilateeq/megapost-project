import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="site-logo" end>
          Maga<span>Post</span>
        </NavLink>
        <nav className="site-nav" aria-label="Main">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `site-nav__link${isActive ? ' active' : ''}`
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/add-post"
            className={({ isActive }) =>
              `site-nav__link${isActive ? ' active' : ''}`
            }
          >
            Add post
          </NavLink>
          <NavLink
            to="/all-posts"
            className={({ isActive }) =>
              `site-nav__link${isActive ? ' active' : ''}`
            }
          >
            All posts
          </NavLink>
          <span className="site-nav__user" title={user?.email}>
            {user?.email}
          </span>
          <button type="button" className="btn btn--ghost" onClick={logout}>
            Logout
          </button>
        </nav>
      </div>
    </header>
  )
}
