/** @param {string} text */
function legacyPlainToHtml(text) {
  const s = String(text)
  const esc = (t) =>
    t
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  if (!s.trim()) return ''
  const parts = s.split(/\n\n+/)
  if (parts.length === 1) {
    return `<p>${esc(parts[0]).replace(/\n/g, '<br>')}</p>`
  }
  return parts.map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('')
}

/**
 * HTML for v2 posts; legacy plain text wrapped for editors and display.
 * @param {{ contentVersion?: number } | null | undefined} post
 * @param {'title' | 'description'} field
 */
export function getFieldHtml(post, field) {
  if (!post) return ''
  const raw = post[field]
  if (post.contentVersion === 2) return raw || ''
  return legacyPlainToHtml(raw || '')
}

/** @param {string | null | undefined} html */
export function isRichTextEmpty(html) {
  if (!html || typeof html !== 'string') return true
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const body = doc.body
  if (body.querySelector('img')) return false
  return !(body.textContent || '').trim()
}

/** @param {string | null | undefined} html */
export function htmlToPlainPreview(html, max = 72) {
  const doc = new DOMParser().parseFromString(html || '', 'text/html')
  const t = (doc.body.textContent || '').replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t || 'Untitled'
  return `${t.slice(0, max)}…`
}

export const POST_CONTENT_VERSION = 2

/** ~1.5 MB raw file before base64 (keeps localStorage usable) */
export const MAX_IMAGE_FILE_BYTES = 1.5 * 1024 * 1024
