import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { RichTextEditor } from '../components/RichTextEditor'
import { usePosts } from '../context/PostsContext'
import { getFieldHtml, isRichTextEmpty } from '../lib/richText'

function EditPostForm({ postId }) {
  const { getPost, updatePost } = usePosts()
  const navigate = useNavigate()
  const post = getPost(postId)

  const [titleHtml, setTitleHtml] = useState(() =>
    post ? getFieldHtml(post, 'title') : '',
  )
  const [descriptionHtml, setDescriptionHtml] = useState(() =>
    post ? getFieldHtml(post, 'description') : '',
  )
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (isRichTextEmpty(titleHtml) || isRichTextEmpty(descriptionHtml)) {
      setError('Please add a title and description (text or image in the body).')
      return
    }
    if (updatePost(postId, titleHtml, descriptionHtml)) navigate('/all-posts')
    else setError('Could not update this post.')
  }

  if (!post) {
    return (
      <div className="page">
        <h1 className="page-title">Post not found</h1>
        <p className="page-lead">
          This post does not exist or does not belong to you.
        </p>
        <Link to="/all-posts" className="btn btn--secondary">
          Back to all posts
        </Link>
      </div>
    )
  }

  return (
    <div className="page">
      <h1 className="page-title">Edit post</h1>
      <form className="form form--card" onSubmit={handleSubmit}>
        {error ? (
          <p className="form__error" role="alert">
            {error}
          </p>
        ) : null}
        <label className="form__label">
          Title
          <RichTextEditor
            value={titleHtml}
            onChange={setTitleHtml}
            placeholder="Title with optional formatting"
            variant="title"
            withImages={false}
          />
        </label>
        <label className="form__label">
          Description
          <RichTextEditor
            value={descriptionHtml}
            onChange={setDescriptionHtml}
            placeholder="Body text and images"
            variant="body"
            withImages
          />
        </label>
        <div className="form__actions">
          <button type="submit" className="btn btn--primary">
            Save changes
          </button>
          <Link to="/all-posts" className="btn btn--ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

export function EditPost() {
  const { id } = useParams()
  return <EditPostForm key={id} postId={id} />
}
