import { sanitizePostHtml } from '../lib/sanitizeHtml'

/**
 * Renders stored post HTML after sanitization (safe for public demos).
 * @param {{ html: string, className?: string }} props
 */
export function RichContent({ html, className = '' }) {
  if (!html?.trim()) return null
  const clean = sanitizePostHtml(html)
  if (!clean.trim()) return null
  return (
    <div
      className={`rich-content ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}
