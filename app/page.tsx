'use client'

import { useState } from 'react'
import Editor from '@/components/Editor'
import ChatSidebar from '@/components/ChatSidebar'
import { Sparkles, FileText } from 'lucide-react'

export default function Home() {
  const [editorContent, setEditorContent] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Main Editor Area */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'mr-0' : 'mr-0'}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <header className="glass-effect border-b border-white/20 p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                  <FileText size={24} />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    AI Collaborative Editor
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">Write, edit, and enhance with AI assistance</p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg bg-white/80 hover:bg-white transition-colors shadow-sm"
              >
                <Sparkles size={20} className="text-purple-600" />
              </button>
            </div>
          </header>

          {/* Editor Container */}
          <div className="flex-1 p-4 lg:p-6 overflow-hidden">
            <div className="h-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
              <Editor content={editorContent} onChange={setEditorContent} />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} 
        fixed lg:relative right-0 top-0 h-full w-full max-w-sm lg:max-w-none lg:w-96 
        transition-transform duration-300 ease-in-out z-40 lg:z-auto lg:translate-x-0`}>
        <ChatSidebar 
          onInsertText={(text) => setEditorContent(prev => prev + '\n' + text)}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}