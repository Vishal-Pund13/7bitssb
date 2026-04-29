'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import Link from '@tiptap/extension-link'
import { useEffect } from 'react'

interface TipTapRendererProps {
  content: Record<string, unknown>
}

export default function TipTapRenderer({ content }: TipTapRendererProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Link.configure({ openOnClick: true }),
    ],
    content,
    editable: false,
    immediatelyRender: false,
  })

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  return <EditorContent editor={editor} />
}
