'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, X, Sparkles, Copy, Check } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface ChatSidebarProps {
  onInsertText: (text: string) => void
  onClose?: () => void
}

export default function ChatSidebar({ onInsertText, onClose }: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Hello! I\'m your AI writing assistant. I can help you write, edit, and improve your content. Try selecting some text in the editor or ask me anything!',
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, type: 'chat' })
      })

      const data = await response.json()
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'ai',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(messageId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="w-full h-full bg-white/95 backdrop-blur-sm border-l border-white/20 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="glass-effect border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">AI Assistant</h2>
              <p className="text-xs text-gray-600">Always ready to help</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          )}
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-blue-50/30">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-enter flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              }`}>
                {message.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className="flex flex-col gap-1">
                <div className={`p-3 rounded-2xl shadow-sm ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  
                  {message.sender === 'ai' && (
                    <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => onInsertText(message.text)}
                        className="text-xs bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-1"
                      >
                        <Send size={12} />
                        Insert to Editor
                      </button>
                      <button
                        onClick={() => copyToClipboard(message.text, message.id)}
                        className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-1"
                      >
                        {copiedId === message.id ? <Check size={12} /> : <Copy size={12} />}
                        {copiedId === message.id ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>
                <span className={`text-xs text-gray-500 px-2 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center">
              <Bot size={14} />
            </div>
            <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-md shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="typing-indicator"></div>
                  <div className="typing-indicator"></div>
                  <div className="typing-indicator"></div>
                </div>
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-white/20 glass-effect">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask AI anything..."
            className="flex-1 px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 placeholder-gray-500"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  )
}