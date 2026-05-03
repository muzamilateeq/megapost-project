import { Link } from 'react-router-dom'
import { RichContent } from '../components/RichContent'
import { usePosts } from '../context/PostsContext'
import { getFieldHtml, htmlToPlainPreview } from '../lib/richText'

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

export function AllPosts() {
  const { posts, deletePost } = usePosts()

  function handleDelete(id, titleHtml) {
    const label = htmlToPlainPreview(titleHtml)
    if (
      window.confirm(
        `Delete “${label}”? This cannot be undone in this demo.`,
      )
    ) {
      deletePost(id)
    }
  }

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">All posts</h1>
          <p className="page-lead">
            {posts.length === 0
              ? 'No posts yet — add your first one.'
              : `${posts.length} post${posts.length === 1 ? '' : 's'} in your account.`}
          </p>
        </div>
        <Link to="/add-post" className="btn btn--primary">
          Add post
        </Link>
      </div>
      {posts.length === 0 ? (
        <div className="empty-state">
          <p>You have not created any posts yet.</p>
          <Link to="/add-post" className="btn btn--secondary">
            Create a post
          </Link>
        </div>
      ) : (
        <ul className="post-list">
          {posts.map((p) => (
            <li key={p.id} className="post-card">
              <div className="post-card__body">
                <RichContent
                  html={getFieldHtml(p, 'title')}
                  className="post-card__title rich-content--title"
                />
                <RichContent
                  html={getFieldHtml(p, 'description')}
                  className="post-card__desc"
                />
                <p className="post-card__meta">
                  Updated {formatDate(p.updatedAt)}
                </p>
              </div>
              <div className="post-card__actions">
                <Link
                  to={`/edit-post/${p.id}`}
                  className="btn btn--small btn--secondary"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  className="btn btn--small btn--danger"
                  onClick={() =>
                    handleDelete(p.id, getFieldHtml(p, 'title'))
                  }
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
