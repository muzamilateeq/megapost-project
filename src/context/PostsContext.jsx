import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  isRichTextEmpty,
  POST_CONTENT_VERSION,
} from '../lib/richText'
import { getAllPosts, saveAllPosts } from '../lib/storage'
import { useAuth } from './AuthContext'

const PostsContext = createContext(null)

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function PostsProvider({ children }) {
  const { user } = useAuth()
  const [posts, setPosts] = useState(() => getAllPosts())

  const addPost = useCallback(
    (title, description) => {
      if (!user) return null
      if (isRichTextEmpty(title) || isRichTextEmpty(description)) return null
      const now = new Date().toISOString()
      const post = {
        id: newId(),
        ownerEmail: user.email,
        title,
        description,
        contentVersion: POST_CONTENT_VERSION,
        createdAt: now,
        updatedAt: now,
      }
      let created = null
      setPosts((prev) => {
        const next = [post, ...prev]
        saveAllPosts(next)
        created = post
        return next
      })
      return created
    },
    [user],
  )

  const updatePost = useCallback((id, title, description) => {
    if (!user) return false
    if (isRichTextEmpty(title) || isRichTextEmpty(description)) return false
    let ok = false
    setPosts((prev) => {
      const idx = prev.findIndex((p) => p.id === id)
      if (idx === -1) return prev
      const p = prev[idx]
      if (p.ownerEmail !== user.email) return prev
      ok = true
      const next = [...prev]
      next[idx] = {
        ...p,
        title,
        description,
        contentVersion: POST_CONTENT_VERSION,
        updatedAt: new Date().toISOString(),
      }
      saveAllPosts(next)
      return next
    })
    return ok
  }, [user])

  const deletePost = useCallback((id) => {
    if (!user) return false
    let ok = false
    setPosts((prev) => {
      const target = prev.find((p) => p.id === id)
      if (!target || target.ownerEmail !== user.email) return prev
      ok = true
      const next = prev.filter((p) => p.id !== id)
      saveAllPosts(next)
      return next
    })
    return ok
  }, [user])

  const myPosts = useMemo(() => {
    if (!user) return []
    return posts.filter((p) => p.ownerEmail === user.email)
  }, [user, posts])

  const getPost = useCallback(
    (id) => {
      if (!user) return null
      const p = posts.find((x) => x.id === id)
      if (!p || p.ownerEmail !== user.email) return null
      return p
    },
    [user, posts],
  )

  const value = useMemo(
    () => ({
      posts: myPosts,
      addPost,
      updatePost,
      deletePost,
      getPost,
    }),
    [myPosts, addPost, updatePost, deletePost, getPost],
  )

  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  )
}

export function usePosts() {
  const ctx = useContext(PostsContext)
  if (!ctx) throw new Error('usePosts must be used within PostsProvider')
  return ctx
}
