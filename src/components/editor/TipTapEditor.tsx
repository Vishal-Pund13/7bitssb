'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Code,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus,
  Table as TableIcon, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight,
  Undo, Redo, Link as LinkIcon,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCallback } from 'react'

interface TipTapEditorProps {
  content?: Record<string, unknown> | null
  onChange: (content: Record<string, unknown>) => void
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded text-sm transition-colors ${
        active
          ? 'bg-navy-700 text-white'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
      } disabled:opacity-40`}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-gray-200 dark:bg-gray-600 mx-1" />
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const supabase = createClient()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      ImageExtension.configure({ inline: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: 'Begin writing your analysis...',
      }),
    ],
    content: content || undefined,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON() as Record<string, unknown>)
    },
  })

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file || !editor) return

      const fileName = `${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('article-images')
        .upload(fileName, file)

      if (error) {
        alert('Upload failed: ' + error.message)
        return
      }

      const { data: urlData } = supabase.storage
        .from('article-images')
        .getPublicUrl(data.path)

      editor.chain().focus().setImage({ src: urlData.publicUrl }).run()
    }
    input.click()
  }, [editor, supabase])

  const handleAddLink = useCallback(() => {
    const url = window.prompt('URL:')
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50 dark:bg-[#1a2535] border-b border-gray-200 dark:border-gray-600">
        {/* Undo/Redo */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo size={16} />
        </ToolbarButton>
        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </ToolbarButton>
        <ToolbarDivider />

        {/* Format */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="Inline Code"
        >
          <Code size={16} />
        </ToolbarButton>
        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus size={16} />
        </ToolbarButton>
        <ToolbarDivider />

        {/* Align */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Center"
        >
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight size={16} />
        </ToolbarButton>
        <ToolbarDivider />

        {/* Table */}
        <ToolbarButton
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          title="Insert Table"
        >
          <TableIcon size={16} />
        </ToolbarButton>

        {/* Image */}
        <ToolbarButton onClick={handleImageUpload} title="Upload Image">
          <ImageIcon size={16} />
        </ToolbarButton>

        {/* Link */}
        <ToolbarButton
          onClick={handleAddLink}
          active={editor.isActive('link')}
          title="Add Link"
        >
          <LinkIcon size={16} />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <div className="bg-paper-DEFAULT dark:bg-[#1a2535] min-h-[400px]">
        <EditorContent
          editor={editor}
          className="article-body !bg-transparent !bg-none !p-6 !shadow-none !max-w-full !rounded-none"
        />
      </div>
    </div>
  )
}
