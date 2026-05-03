import { Link } from 'react-router-dom'
import { RichContent } from '../components/RichContent'
import { useAuth } from '../context/AuthContext'
import { usePosts } from '../context/PostsContext'
import { getFieldHtml } from '../lib/richText'

export function Home() {
  const { user } = useAuth()
  const { posts } = usePosts()

  return (
    <div className="page page--home">
      <section className="hero-block">
        <p className="eyebrow">Signed in as {user?.email}</p>
        <h1 className="hero-block__title">Your writing space</h1>
        <p className="hero-block__lead">
          Create rich posts with formatting and images. Everything stays in this
          browser (local demo).
        </p>
        <div className="hero-block__actions">
          <Link to="/add-post" className="btn btn--primary">
            New post
          </Link>
          <Link to="/all-posts" className="btn btn--secondary">
            View all ({posts.length})
          </Link>
        </div>
      </section>
      {posts.length > 0 ? (
        <section className="preview-list">
          <h2 className="section-title">Recent posts</h2>
          <ul className="post-preview-grid">
            {posts.slice(0, 3).map((p) => (
              <li key={p.id} className="post-preview-card">
                <RichContent
                  html={getFieldHtml(p, 'title')}
                  className="post-preview-card__title rich-content--title"
                />
                <RichContent
                  html={getFieldHtml(p, 'description')}
                  className="post-preview-card__desc rich-content--clamp"
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
