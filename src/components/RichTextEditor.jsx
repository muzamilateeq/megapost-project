import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { MAX_IMAGE_FILE_BYTES } from '../lib/richText'

function ToolbarButton({ onClick, active, disabled, children, title }) {
  return (
    <button
      type="button"
      className={`rte-toolbar__btn${active ? ' rte-toolbar__btn--active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-pressed={active}
    >
      {children}
    </button>
  )
}

/**
 * @param {{
 *   value: string
 *   onChange: (html: string) => void
 *   placeholder?: string
 *   variant?: 'title' | 'body'
 *   withImages?: boolean
 * }} props
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write here…',
  variant = 'body',
  withImages = true,
}) {
  const fileRef = useRef(null)

  const extensions = useMemo(() => {
    const headingLevels = variant === 'title' ? [2, 3] : [1, 2, 3]
    const list = [
      StarterKit.configure({
        heading: { levels: headingLevels },
      }),
      Placeholder.configure({ placeholder }),
      Underline,
    ]
    if (withImages && variant === 'body') {
      list.push(
        Image.configure({
          HTMLAttributes: { class: 'rich-content__img' },
        }),
      )
    }
    return list
  }, [placeholder, variant, withImages])

  const editor = useEditor({
    extensions,
    content: value || '',
    editorProps: {
      attributes: {
        class:
          variant === 'title'
            ? 'rte-prose rte-prose--title'
            : 'rte-prose rte-prose--body',
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML())
    },
  })

  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    const v = value || ''
    const cur = editor.getHTML()
    if (v !== cur) editor.commands.setContent(v, false)
  }, [editor, value])

  const pickImage = useCallback(() => fileRef.current?.click(), [])

  const onImageFile = useCallback(
    (e) => {
      const file = e.target.files?.[0]
      e.target.value = ''
      if (!file || !file.type.startsWith('image/') || !editor) return
      if (file.size > MAX_IMAGE_FILE_BYTES) {
        window.alert(
          `Image is too large for this demo (max ${Math.round(MAX_IMAGE_FILE_BYTES / (1024 * 1024))} MB).`,
        )
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        const src = reader.result
        if (typeof src === 'string') {
          editor.chain().focus().setImage({ src }).run()
        }
      }
      reader.readAsDataURL(file)
    },
    [editor],
  )

  if (!editor) return null

  const e = editor

  return (
    <div
      className={`rte-editor${variant === 'title' ? ' rte-editor--title' : ' rte-editor--body'}`}
    >
      <div className="rte-toolbar" role="toolbar" aria-label="Formatting">
        <ToolbarButton
          title="Bold"
          active={e.isActive('bold')}
          onClick={() => e.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={e.isActive('italic')}
          onClick={() => e.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={e.isActive('underline')}
          onClick={() => e.chain().focus().toggleUnderline().run()}
        >
          <span className="rte-underline">U</span>
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          active={e.isActive('strike')}
          onClick={() => e.chain().focus().toggleStrike().run()}
        >
          <s>S</s>
        </ToolbarButton>
        <span className="rte-toolbar__sep" aria-hidden />
        {variant === 'body' ? (
          <ToolbarButton
            title="Heading 1"
            active={e.isActive('heading', { level: 1 })}
            onClick={() =>
              e.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            H1
          </ToolbarButton>
        ) : null}
        <ToolbarButton
          title="Heading 2"
          active={e.isActive('heading', { level: 2 })}
          onClick={() => e.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={e.isActive('heading', { level: 3 })}
          onClick={() => e.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <span className="rte-toolbar__sep" aria-hidden />
        <ToolbarButton
          title="Bullet list"
          active={e.isActive('bulletList')}
          onClick={() => e.chain().focus().toggleBulletList().run()}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          active={e.isActive('orderedList')}
          onClick={() => e.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </ToolbarButton>
        <ToolbarButton
          title="Quote"
          active={e.isActive('blockquote')}
          onClick={() => e.chain().focus().toggleBlockquote().run()}
        >
          “ ”
        </ToolbarButton>
        <span className="rte-toolbar__sep" aria-hidden />
        <ToolbarButton
          title="Undo"
          onClick={() => e.chain().focus().undo().run()}
          disabled={!e.can().undo()}
        >
          Undo
        </ToolbarButton>
        <ToolbarButton
          title="Redo"
          onClick={() => e.chain().focus().redo().run()}
          disabled={!e.can().redo()}
        >
          Redo
        </ToolbarButton>
        {withImages && variant === 'body' ? (
          <>
            <span className="rte-toolbar__sep" aria-hidden />
            <ToolbarButton title="Insert image" onClick={pickImage}>
              Image
            </ToolbarButton>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="rte-file-input"
              onChange={onImageFile}
            />
          </>
        ) : null}
      </div>
      <EditorContent editor={e} className="rte-editor__surface" />
    </div>
  )
}
