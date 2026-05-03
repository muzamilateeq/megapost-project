import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RichTextEditor } from '../components/RichTextEditor'
import { usePosts } from '../context/PostsContext'
import { isRichTextEmpty } from '../lib/richText'

export function AddPost() {
  const { addPost } = usePosts()
  const navigate = useNavigate()
  const [titleHtml, setTitleHtml] = useState('')
  const [descriptionHtml, setDescriptionHtml] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (isRichTextEmpty(titleHtml) || isRichTextEmpty(descriptionHtml)) {
      setError('Please add a title and description (text or image in the body).')
      return
    }
    const post = addPost(titleHtml, descriptionHtml)
    if (post) navigate('/all-posts')
    else setError('Could not save the post.')
  }

  return (
    <div className="page">
      <h1 className="page-title">Add post</h1>
      <p className="page-lead">
        Use the toolbar for bold, italic, headings, lists, and images in the
        description. The title supports the same text styles (images are for the
        body only).
      </p>
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
            placeholder="Write your post. Use Image to upload a picture (stored in this browser)."
            variant="body"
            withImages
          />
        </label>
        <div className="form__actions">
          <button type="submit" className="btn btn--primary">
            Publish post
          </button>
        </div>
      </form>
    </div>
  )
}
