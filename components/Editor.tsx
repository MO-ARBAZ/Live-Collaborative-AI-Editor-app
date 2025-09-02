'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState, useEffect } from 'react'
import FloatingToolbar from './FloatingToolbar'
import { Type, Sparkles } from 'lucide-react'

interface EditorProps {
  content: string
  onChange: (content: string) => void
}

export default function Editor({ content, onChange }: EditorProps) {
  const [selection, setSelection] = useState<{ from: number; to: number; text: string } | null>(null)
  const [toolbarPosition, setToolbarPosition] = useState<{ x: number; y: number } | null>(null)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '<p>Start writing your content here...</p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
      
      // Update word and character counts
      const text = editor.getText()
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0)
      setCharCount(text.length)
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection
      if (from !== to) {
        const text = editor.state.doc.textBetween(from, to)
        setSelection({ from, to, text })
        
        // Get selection position for toolbar
        const coords = editor.view.coordsAtPos(from)
        setToolbarPosition({ x: coords.left, y: coords.top - 60 })
      } else {
        setSelection(null)
        setToolbarPosition(null)
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6',
      },
    },
  })

  const handleAIEdit = async (selectedText: string, action: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `${action}: "${selectedText}"`,
          type: 'edit'
        })
      })
      
      const data = await response.json()
      return data.response
    } catch (error) {
      console.error('AI edit failed:', error)
      return selectedText
    }
  }

  const replaceSelection = (newText: string) => {
    if (editor && selection) {
      editor.chain().focus().deleteRange({ from: selection.from, to: selection.to }).insertContent(newText).run()
      setSelection(null)
      setToolbarPosition(null)
    }
  }

  return (
    <div className="relative h-full flex flex-col">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Type size={16} />
            <span className="text-sm font-medium">Rich Text Editor</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Sparkles size={14} className="text-purple-500" />
          <span>Select text for AI editing</span>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent 
          editor={editor} 
          className="h-full"
        />
      </div>
      
      {selection && toolbarPosition && (
        <FloatingToolbar
          position={toolbarPosition}
          selectedText={selection.text}
          onAIEdit={handleAIEdit}
          onReplace={replaceSelection}
        />
      )}
    </div>
  )
}