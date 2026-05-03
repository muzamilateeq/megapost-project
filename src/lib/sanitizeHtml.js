import DOMPurify from 'dompurify'

/**
 * Sanitize rich HTML before rendering (XSS mitigation for public demos).
 * Tuned for TipTap output: headings, lists, quotes, images (incl. data URLs).
 */
const PURIFY = {
  USE_PROFILES: { html: true },
  ADD_TAGS: ['u'],
  ADD_ATTR: ['class'],
}

export function sanitizePostHtml(html) {
  if (typeof html !== 'string' || !html.trim()) return ''
  return DOMPurify.sanitize(html, PURIFY)
}
